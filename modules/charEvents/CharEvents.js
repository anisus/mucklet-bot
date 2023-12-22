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

		this.subs = [];
		this.botModel = this.module.bot.getModel();
		this.bot = null;
		this.controlled = null;
		this._listenModel(true);
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

	_listenModel= (on) => {
		if (this.botModel) {
			this.botModel[on ? 'on' : 'off']('change', this._onModelChange);
		}
	}


	_onModelChange = () => {
		let bot = this.botModel?.bot || null;
		if (bot === this.bot) return;

		this._listenBot(false);
		this.bot = bot;
		this._listenBot(true);
		this._onBotChange();
	}

	_listenBot = (on) => {
		if (this.bot) {
			this.bot[on ? 'on' : 'off']('change', this._onBotChange);
		}
	}

	_onBotChange = () => {
		let controlled = this.bot?.controlled || null;
		if (controlled === this.controlled) return;

		this._listenControlled(false);
		this.controlled = controlled;
		this._listenControlled(true);
	}

	_listenControlled = (on) => {
		if (this.controlled) {
			this.controlled[on ? 'on' : 'off']('out', this._onOut);
		}
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
		this._listenControlled(false);
		this._listenBot(false);
		this._listenModel(false);
		this.controlled = null;
		this.bot = null;
	}
}

export default CharEvents;
