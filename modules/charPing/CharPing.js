import setParams from '#utils/setParams.js';

const defaultDuration = 1000 * 60 * 3; // 3 minutes between successful pings
const defaultThreshold = 1000 * 60 * 5; // 5 minutes until character is put to sleep
const defaultRetry = 1000 * 15; // 15 seconds between retries

/**
 * CharPing parameters.
 * @typedef {Object} CharPing~Params
 * @property {number} [duration] Duration in milliseconds between successful pings.
 * @property {number} [threshold] Threshold in milliseconds after which a character is put to sleep.
 * @property {number} [retry] Duration in milliseconds beteween retries on failed pings.
 */

/**
 * CharPing periodically sends a ping for all controlled characters to ensure
 * they are kept awake.
 *
 * If the botController module is available, it will only ping characters
 * validated by botController.validChar
 */
class CharPing {

	/**
	 * Creates a new CharPing instance.
	 * @param {App} app Modapp App object.
	 * @param {CharPing~Params} params Module parameters.
	 */
	constructor(app, params) {
		this.app = app;
		// Params
		setParams(this, params, {
			duration: { type: 'number', default: defaultDuration},
			threshold: { type: 'number', default: defaultThreshold },
			retry: { type: 'number', default: defaultRetry },
		});

		this.app.require([ 'player', 'api' ], this._init);
	}

	_init = (module) => {
		this.module = Object.assign({ self: this }, module);

		this.controlled = null;
		this.timers = {};
		this.playerModel = this.module.player.getModel();
		this.playerModel.on('change', this._onModelChange);
		this._onModelChange();
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
			for (let char of c) {
				this._removeChar(char);
			}
			this.timers = {};
		}
	}

	_ping(char, since) {
		since = since || 0;
		this.timers[char.id] = true;
		// console.debug("charPing: Pinging char " + char.id);
		char.call('ping').then(() => {
			if (!this.timers[char.id]) return;
			// On successful ping
			let t = setTimeout(() => {
				if (this.timers[char.id] === t) {
					this._ping(char);
				}
			}, this.duration);
			this.timers[char.id] = t;
		}).catch(err => {
			if (!this.timers[char.id]) return;
			// On failed ping
			let d = since < this.threshold ? this.retry : this.duration;
			console.error("Error pinging " + char.id + ". Retrying in " + (d / 1000) + " seconds: ", err);
			let t = setTimeout(() => {
				if (this.timers[char.id] === t) {
					this._ping(char, since + d);
				}
			}, d);
			this.timers[char.id] = t;
		});
	}

	_addChar(char) {
		if (this._validChar(char)) {
			this._ping(char);
		}
	}

	_removeChar(char) {
		let t = this.timers[char.id];
		if (t) {
			clearTimeout(this.timers[char.id]);
			delete this.timers[char.id];
		}
	}

	_onAdd = (ev) => {
		this._addChar(ev.item);
	}

	_onRemove = (ev) => {
		this._removeChar(ev.item);
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
		this.playerModel.off('change', this._onModelChange);
	}
}

export default CharPing;
