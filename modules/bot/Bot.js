import { Model } from 'modapp-resource';
import findById from '#utils/findById.js';

/**
 * bot fetches the bot object and keeps it suscribed once logged in.
 */
class bot {
	constructor(app, params) {
		this.app = app;

		this.app.require([
			'login',
			'api',
		], this._init);
	}

	_init = (module) => {
		this.module = Object.assign({ self: this }, module);

		this.model = new Model({ data: { bot: null }, eventBus: this.app.eventBus });
		// Try to fetch bot model as soon as logged in.
		this.getBotPromise();
	}

	/**
	 * Returns the module model.
	 * @returns {Model} Module model.
	 */
	getModel() {
		return this.model;
	}

	/**
	 * Returns a promise that resolves with the bot model, containing all
	 * characters and their info, of the logged in user.
	 * @returns {Promise.<Model>} Promise of the bot model.
	 */
	getBotPromise() {
		return this.botPromise = this.botPromise || this._tryGetbot();
	}

	/**
	 * Returns an character of the bot. If the bot isn't loaded, null is
	 * returned.
	 * @returns {?Model} Bot character model or null.
	 */
	getChar() {
		return this.model.bot?.char || null;
	}

	/**
	 * Returns the controlled bot character. If the character is not controlled,
	 * or if the bot isn't loaded, null is returned;
	 * @returns {?Model} Controlled character model or null.
	 */
	getControlledChar() {
		return this.model.bot?.controlled || null;
	}

	_tryGetbot() {
		return this.module.login.getUserPromise()
			.then(user => this.module.api.call('core', 'getBot'))
			.then(bot => {
				bot.on('unsubscribe', this._onUnsubscribe);
				this.model.set({ bot });
				return bot;
			})
			.catch(err => {
				this.botPromise = null;
				throw err;
			});
	}

	_onUnsubscribe = () => {
		// Remove bot model subscription
		if (this.model.bot) {
			this.model.bot.off('unsubscribe', this._onUnsubscribe);
		}
		this.model.set({ bot: null });
		this.botPromise = null;
	}

	dispose() {
		this._onUnsubscribe();
	}

}

export default bot;
