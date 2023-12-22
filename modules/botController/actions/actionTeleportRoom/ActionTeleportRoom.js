import setParams from '#utils/setParams.js';
import { populationProbability } from '#utils/probability.js';

/**
 * ActionTeleportRoom parameters.
 * @typedef {Object} ActionTeleportRoom~Params
 * @property {object} [populationProbability] Probabilities of the action to occur based on room population.
 * @property {number} [delay] Delay in milliseconds to wait prior to executing the action.
 * @property {number} [postdelay] Delay in milliseconds to wait after executing the action.
 */

/**
 * ActionTeleportRoom adds the action to teleport.
 */
class ActionTeleportRoom {

	/**
	 * Creates a new ActionTeleportRoom instance.
	 * @param {App} app Modapp App object.
	 * @param {ActionTeleportRoom~Params} params Module parameters.
	 */
	constructor(app, params) {
		this.app = app;
		// Params
		setParams(this, params, {
			populationProbability: { type: '?object' },
			delay: { type: 'number' },
			postdelay: { type: 'number' },
			allowedDestinations: { type: '?array' },
		});

		this.app.require([ 'botController', 'api', 'bot' ], this._init);
	}

	_init = (module) => {
		this.module = Object.assign({ self: this }, module);

		this.module.botController.addAction({
			id: 'teleportRoom',
			outcomes: this._outcomes,
			exec: this._exec,
		});

		// Fetch global teleport nodes as soon as logged in
		this.globalTeleports = null;
		this.module.bot.getBotPromise()
			.then(() => this.module.api.get('core.nodes'))
			.then(globalTeleports => {
				// Assert module is not disposed
				if (this.app) {
					globalTeleports.on();
					this.globalTeleports = globalTeleports;
				}
			});
	}

	_outcomes = (bot, state) => {
		if (!this.populationProbability || !this.allowedDestinations) return;

		let ctrl = bot.controlled;

		// Assert we have any controlled characters in rooms with exits.
		if (!ctrl || !this.allowedDestinations.filter(id => id != ctrl.inRoom.id).length) return;

		return {
			probability: populationProbability(ctrl.inRoom, this.populationProbability),
			delay: this.delay,
			postdelay: this.postdelay,
		};
	}

	_exec = (bot, state, outcome) => {
		let ctrl = bot.controlled;
		if (!ctrl) {
			return Promise.reject(`char not controlled`);
		}

		// Exclude current room.
		let rooms = this.allowedDestinations.filter(id => id != ctrl.inRoom.id)
		if (!rooms.length) {
			return Promise.reject(`char ${ctrl.name} ${ctrl.surname} has no valid teleport nodes`);
		}

		let roomId = rooms[Math.floor(Math.random() * rooms.length)];
		return ctrl.call('teleport', { roomId })
			.then(() => `${ctrl.name} ${ctrl.surname} used teleport to #${roomId}`);
	}

	dispose() {
		this.module.botController.removeAction('teleportRoom');
		if (this.globalTeleports) {
			this.globalTeleports.off();
		}
		this.app = null;
	}

}

export default ActionTeleportRoom;
