/**
 * CharEvents listens to outgoing log events for the controlled character.
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

		this.app.require([ 'bot' ], this._init);
	}

	_init = (module) => {
		this.module = Object.assign({ self: this }, module);

		this.controlled = null;
		this.subs = [];
		this.botModel = this.module.bot.getModel();
		this.botModel.on('change', this._onModelChange);
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
		let c = this.botModel.bot && this.botModel.bot.controlled;
		if (c === this.controlled) return;

		this._setEventListeners(false);
		this.controlled = c;
		this._setEventListeners(true);
	}

	_setEventListeners = (on) => {
		let c = this.controlled;
		if (!c) return;

		c[on ? 'on' : 'off']('out', this._onOut);
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

	dispose() {
		this._setEventListeners(false);
		this.controlled = null;
		this.subs = null;
		this.botModel.off('change', this._onModelChange);
	}
}

export default CharEvents;
