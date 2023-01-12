import { Model } from 'modapp-resource';
import setParams from '#utils/setParams.js';

/**
 * Bot logs in to the API and fetches the bot model.
 */
class Bot {
	constructor(app, params) {
		this.app = app;

		// Params
		setParams(this, params, {
			token: { type: 'string' },
		});

		this.app.require([
			'api',
		], this._init);
	}

	_init = (module) => {
		this.module = Object.assign({ self: this }, module);

		this.model = new Model({ data: { loggedIn: false, loginError: null, bot: null }, eventBus: this.app.eventBus });

		// Set the authentication callback called everytime we connect to the API.
		this.module.api.setOnConnect(this._authenticate);
	}

	/**
	 * Connects to the API and returns a promise that resolves with the logged
	 * in bot.
	 * @returns {Promise.<Model>} Promise of the bot model.
	 */
	login() {
		let promise = this.getBotPromise();
		this._tryGetBot();
		return promise;
	}

	/**
	 * Returns the module model.
	 * @returns {Model} Module model.
	 */
	getModel() {
		return this.model;
	}

	/**
	 * Returns a promise that resolves with the logged in bot.
	 * @returns {Promise.<Model>} Promise of the bot model.
	 */
	getBotPromise() {
		return this.botPromise = this.botPromise || (
			this.model.bot
				? Promise.resolve(this.model.bot)
				: new Promise((resolve, reject) => {
					this.botPromiseCallbacks = { resolve, reject };
				})
		);
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

	_tryGetBot() {
		return this.module.api.connect()
			.then(() => {
				if (this.model.loggedIn) {
					return this.model.bot
						? Promise.resolve(this.model.bot)
						: this.module.api.call('core', 'getBot')
							.then(bot => {
								this.model.set({ bot });
								// If the bot model is forcefully unsubscribed,
								// the bot token is most likely revoked.
								bot.on('unsubscribe', this._onUnsubscribe);
								return bot;
							});
				}
				return Promise.reject(this.model.loginError || "Failed to login");
			})
			.then(bot => this._resolve(bot))
			.catch(err => this._reject(err));
	}

	_authenticate = () => {
		return this.module.api.authenticate('auth', 'authenticateBot', {
			token: this.token,
		}).then(() => {
			this.model.set({ loggedIn: true, loginError: null });
		}).catch(err => {
			// If we had a bot, this is a failed reconnect
			if (this.model.bot) {
				this._reject(err);
			}
			this.model.set({ loggedIn : false, bot: null, loginError: err });
		});
	}

	_resolve(bot) {
		if (this.botPromiseCallbacks) {
			this.botPromiseCallbacks.resolve(bot);
			this.botPromiseCallbacks = null;
		}
	}

	_reject(err) {
		if (this.botPromiseCallbacks) {
			this.botPromiseCallbacks.reject(err);
			this.botPromiseCallbacks = null;
		}
		this.botPromise = null;
	}

	_onUnsubscribe = () => {
		// Remove bot model subscription
		if (this.model.bot) {
			this.model.bot.off('unsubscribe', this._onUnsubscribe);
		}
		this.model.set({
			loggedIn: false,
			bot: null
		});
		this.botPromise = null;
	}

	dispose() {
		this._onUnsubscribe();
	}
}

export default Bot;
