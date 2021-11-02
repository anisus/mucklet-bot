/**
 * CharEvents listens to outgoing log events for any controlled character.
 *
 * The purpose is to simplify listening and reacting to events for other
 * modules.
 */
 class CharEvents {

	/**
	 * Creates a new CharEvents instance.
	 * @param {App} app Modapp App object.
	 * @param {CharEvents~Params} params Module parameters.
	 */
	constructor(app, params) {
		this.app = app;

		this.app.require([ 'player' ], this._init);
	}

	_init = (module) => {
		this.module = Object.assign({ self: this }, module);

		this.controlled = null;
		this.subs = [];
		this.chars = {};
		this.playerModel = this.module.player.getModel();
		this.playerModel.on('change', this._onModelChange);
		this._onModelChange();
	}

	/**
	 * Subscribes to char log events.
	 * @param {function} cb Callback called on events: function(char, event)
	 * @returns {function} Unsubscribe function.
	 */
	subscribe(cb) {
		this.subs.push(cb);
		return () => this.unsubscribe(cb);
	}

	/**
	 * Unsubscribes to char log events.
	 * @param {function} cb Callback previously passed to the subscribe method.
	 * @returns {boolean} Returns true if callback was found, eitherwise false.
	 */
	unsubscribe(cb) {
		let idx = this.subs.indexOf(cb);
		if (idx == -1) return false;
		this.subs.splice(idx, 1);
		return true;
	}


	_onModelChange = () => {
		let c = this.playerModel.player && this.playerModel.player.controlled;
		if (c === this.controlled) return;

		this._setEventListeners(false);
		this.controlled = c;
		this._setEventListeners(true);
	}

	_setEventListeners = (on) => {
		let c = this.controlled;
		if (!c) return;

		if (on) {
			c.on('add', this._onAdd);
			c.on('remove', this._onRemove);
			for (let char of c) {
				this._addChar(char);
			}
		} else {
			c.off('add', this._onAdd);
			c.off('remove', this._onRemove);
			for (let k in this.chars) {
				this._removeChar(this.chars[k]);
			}
		}
	}

	_addChar(char) {
		if (this._validChar(char)) {
			this.chars[char.id] = char;
			char.on('out', this._onOut);
		}
	}

	_removeChar(char) {
		let c = this.chars[char.id];
		if (c) {
			c.off('out', this._onOut);
			delete this.chars[c.id];
		}
	}

	_onAdd = (ev) => {
		this._addChar(ev.item);
	}

	_onRemove = (ev) => {
		this._removeChar(ev.item);
	}

	_onOut = (ev, char) => {
		// Call subscriber callbacks
		for (let sub of this.subs) {
			try {
				sub(char, ev);
			} catch (e) {
				console.error("Error on handling event for char " + char.name + ": ", ev, e);
			}
		}
	}

	_validChar(char) {
		// Try get the botController module if it exists
		let botController = this.app.getModule('botController');
		return botController
			? botController.validChar(char.id)
			: true;
	}

	dispose() {
		this._setEventListeners(false);
		this.controlled = null;
		this.subs = null;
		this.chars = null;
		this.playerModel.off('change', this._onModelChange);
	}
}

export default CharEvents;
