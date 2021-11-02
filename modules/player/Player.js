import { Model } from 'modapp-resource';
import findById from '#utils/findById.js';

/**
 * Player fetches the player object and keeps it suscribed once logged in.
 */
class Player {
	constructor(app, params) {
		this.app = app;

		this.app.require([ 'login', 'api' ], this._init);
	}

	_init = (module) => {
		this.module = Object.assign({ self: this }, module);

		this.model = new Model({ data: { player: null }, eventBus: this.app.eventBus });
		// Try to fetch player model as soon as logged in.
		this.getPlayerPromise();
	}

	/**
	 * Returns the module model.
	 * @returns {Model} Module model.
	 */
	getModel() {
		return this.model;
	}

	/**
	 * Returns a promise that resolves with the player model, containing all
	 * characters and their info, of the logged in user.
	 * @returns {Promise.<Model>} Promise of the player model.
	 */
	getPlayerPromise() {
		return this.playerPromise = this.playerPromise || this._tryGetPlayer();
	}

	/**
	 * Returns an owned character with a given ID. If the character is not
	 * owned, or if the player isn't loaded, null is returned;
	 * @param {string} charId Character ID
	 * @returns {?Model} Controlled character model or null.
	 */
	getOwnedChar(charId) {
		return findById(this.model.player && this.model.player.chars, charId);
	}

	/**
	 * Returns a controlled character with a given ID. If the character is not
	 * controlled, or if the player isn't loaded, null is returned;
	 * @param {string} charId Character ID
	 * @returns {?Model} Controlled character model or null.
	 */
	getControlledChar(charId) {
		return findById(this.model.player && this.model.player.controlled, charId);
	}

	_tryGetPlayer() {
		return this.module.login.getUserPromise()
			.then(user => this.module.api.call('core', 'getPlayer'))
			.then(player => {
				player.on('unsubscribe', this._onUnsubscribe);
				this.model.set({ player });
				return player;
			})
			.catch(err => {
				this.playerPromise = null;
				throw err;
			});
	}

	_onUnsubscribe = () => {
		// Remove player model subscription
		if (this.model.player) {
			this.model.player.off('unsubscribe', this._onUnsubscribe);
		}
		this.model.set({ player: null });
		this.playerPromise = null;
	}

	dispose() {
		this._onUnsubscribe();
	}

}

export default Player;
