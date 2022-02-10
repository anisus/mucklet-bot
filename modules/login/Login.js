import { Model } from 'modapp-resource';
import setParams from '#utils/setParams.js';

/**
 * Login parameters.
 * @typedef {Object} Login~Params
 * @property {string} [user] User account name.
 * @property {string} [pass] Password, sha256 hashed and base64 encoded, padded with equal (=). Eg. "mysecret" becomes "ZSx9xofZjJiJME7S5AjHS2EehqQMqlHEtD8d1ZE8XNA="
 * @property {string} [hash] Password, hmacsha256 hashed using the public pepper key "TheStoryStartsHere". Then base64 encoded, padded with equal (=). Eg. "mysecret" becomes "eEhjOWz2QXqUdqcd6RBqt1MJXJ6v9yFGO8lL9jV6/dM="
 */

/**
 * Login logs in the bot after registering it.
 */
class Login {

	/**
	 * Creates a new Login instance.
	 * @param {App} app Modapp App object.
	 * @param {Login~Params} params Module parameters.
	 */
	constructor(app, params) {
		this.app = app;
		// Params
		setParams(this, params, {
			user: { type: 'string' },
			pass: { type: 'string' },
			hash: { type: 'string' },
		});

		this.app.require([ 'api' ], this._init);
	}

	_init = (module) => {
		this.module = Object.assign({ self: this }, module);

		this.model = new Model({ data: { loggedIn: false, loginError: null, user: null }, eventBus: this.app.eventBus });

		// Set the authentication callback called everytime we connect to the API.
		this.module.api.setOnConnect(this._authenticate);
	}

	login() {
		return this._tryGetUser();
	}

	/**
	 * Returns a promise that resolves with the logged in user.
	 * @returns {Promise.<Model>} Promise of the user model.
	 */
	getUserPromise() {
		return this.userPromise = this.userPromise || this._tryGetUser();
	}

	_tryGetUser() {
		return this.module.api.connect()
			.then(() => {
				if (this.model.loggedIn) {
					return this.module.api.call('auth', 'getUser')
						.then(user => {
							this.model.set({ user });

							// If the user model is forcefully unsubscribed,
							// we have been kicked out (banned).
							user.on('unsubscribe', this._onUnsubscribe);
							return user;
						})
				} else if (this.model.loginError && this.model.loginError.code == 'identity.unknownUser') {
					console.log("Unknown user. Trying to register " + this.user);
					return this._tryRegisterUser();
				}

				return Promise.reject(this.model.loginError || "Failed to login");
			})
			.catch(err => {
				this.userPromise = null;
				throw err;
			});

	}

	_tryRegisterUser() {
		return this.module.api.authenticate('auth', 'register', {
			name: this.user,
			pass: this.pass,
			hash: this.hash
		})
			.then(() => this._authenticate())
			.then(() => this._tryGetUser());
	}

	_authenticate = () => {
		return this.module.api.authenticate('auth', 'login', {
			name: this.user,
			pass: this.pass,
			hash: this.hash
		}).then(() => {
			this.model.set({ loggedIn: true, loginError: null });
		}).catch(err => {
			// If we had a user, this is a failed reconnect
			if (this.model.user) {
				this.userPromise = null;
			}
			this.model.set({ loggedIn : false, user: null, loginError: err });
		});
	}

	_onUnsubscribe = () => {
		// Remove user model subscription
		if (this.model.user) {
			this.model.user.off('unsubscribe', this._onUnsubscribe);
		}
		this.model.set({
			loggedIn: false,
			user: null
		});
		this.userPromise = null;
	}

	dispose() {
		this._onUnsubscribe();
	}

}

export default Login;
