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

		this.app.require([ 'bot', 'api' ], this._init);
	}

	_init = (module) => {
		this.module = Object.assign({ self: this }, module);

		this.bot = null;
		this.controlled = null;
		this.timer = null;
		this.botModel = this.module.bot.getModel();
		this.botModel.on('change', this._onBotModelChange);
		this._onBotModelChange();
	}

	_onBotModelChange = () => {
		let bot = this.botModel.bot || null;
		if (bot === this.bot) return;

		this._listenBot(false);
		this.bot = bot;
		this._listenBot(true);
		this._onBotChange();
	}

	_listenBot(on) {
		if (this.bot) {
			this.bot[on ? 'on' : 'off']('change', this._onBotChange);
		}
	}

	_onBotChange = () => {
		let c = this.botModel.bot?.controlled || null;
		if (c === this.controlled) return;

		this._togglePing(false);
		this.controlled = c;
		this._togglePing(true);
	}

	_togglePing = (on) => {
		let c = this.controlled;
		if (!c) return;

		if (on) {
			this._ping(c);
		} else {
			let t = this.timer;
			if (t) {
				clearTimeout(this.timer);
				this.timer = null;
			}
		}
	}

	_ping(char, since) {
		since = since || 0;
		this.timer = true;
		console.debug("charPing: Pinging char " + char.id);
		char.call('ping').then(() => {
			if (!this.timer) return;
			// On successful ping
			let t = setTimeout(() => {
				if (this.timer === t) {
					this._ping(char);
				}
			}, this.duration);
			this.timer = t;
		}).catch(err => {
			if (!this.timer) return;
			// On failed ping
			let d = since < this.threshold ? this.retry : this.duration;
			console.error("Error pinging " + char.id + ". Retrying in " + (d / 1000) + " seconds: ", err);
			let t = setTimeout(() => {
				if (this.timer === t) {
					this._ping(char, since + d);
				}
			}, d);
			this.timer = t;
		});
	}

	dispose() {
		this._togglePing(false);
		this._listenBot(false);
		this.controlled = null;
		this.bot = null;
		this.botModel.off('change', this._onBotModelChange);
	}
}

export default CharPing;
