import setParams from '#utils/setParams.js';
import findById from '#utils/findById.js';
import { populationProbability } from '#utils/probability.js';

/**
 * ActionTeleport parameters.
 * @typedef {Object} ActionTeleport~Params
 * @property {object} [populationProbability] Probabilities of the action to occur based on room population.
 * @property {number} [delay] Delay in milliseconds to wait prior to executing the action.
 * @property {number} [postdelay] Delay in milliseconds to wait after executing the action.
 */

/**
 * ActionTeleport adds the action to teleport.
 */
class ActionTeleport {

	/**
	 * Creates a new ActionTeleport instance.
	 * @param {App} app Modapp App object.
	 * @param {ActionTeleport~Params} params Module parameters.
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
			id: 'teleport',
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
		if (!this.populationProbability) return;

		let ctrl = bot.controlled;

		// Assert we have any controlled characters in rooms with exits.
		if (!ctrl || (
			!this.globalTeleports?.length && // No global teleport nodes
			!ctrl.nodes.toArray().filter(n => n.room.id != ctrl.inRoom.id).length // No character teleport nodes
		)) return;

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

		// Combine global and character specific teleport nodes.
		// Exclude nodes leading to the current room.
		let nodes = this.globalTeleports.toArray().concat(ctrl.nodes.toArray()).filter(n => n.room.id != ctrl.inRoom.id && (!this.allowedDestinations || this.allowedDestinations.indexOf(n.key) >= 0));
		if (!nodes.length) {
			return Promise.reject(`char ${ctrl.name} ${ctrl.surname} has no valid teleport nodes`);
		}

		let node = nodes[Math.floor(Math.random() * nodes.length)];
		return ctrl.call('teleport', { nodeId: node.id })
			.then(() => `${ctrl.name} ${ctrl.surname} used teleport ${node.key}`);
	}

	dispose() {
		this.module.botController.removeAction('teleport');
		if (this.globalTeleports) {
			this.globalTeleports.off();
		}
		this.app = null;
	}

}

export default ActionTeleport;
