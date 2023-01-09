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

		this.app.require([ 'botController', 'api', 'login' ], this._init);
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
		this.module.login.getUserPromise()
			.then(() => this.module.api.get('core.nodes'))
			.then(globalTeleports => {
				// Assert module is not disposed
				if (this.app) {
					globalTeleports.on();
					this.globalTeleports = globalTeleports;
				}
			});
	}

	_outcomes = (player, state) => {
		if (!this.populationProbability) return;

		let chars = player.controlled.toArray()
			.filter(m => this.module.botController.validChar(m.id)
				&& (
					(this.globalTeleports && this.globalTeleports.length) // We have global teleport nodes
					|| m.nodes.toArray().filter(n => n.room.id != m.inRoom.id).length // Character has own nodes
				)
			);

		// Assert we have any controlled characters in rooms with exits.
		if (!chars.length) return;

		return chars
			.map(c => ({
				charId: c.id,
				probability: populationProbability(c.inRoom, this.populationProbability) / chars.length,
				delay: this.delay,
				postdelay: this.postdelay,
			}));
	}

	_exec = (player, state, outcome) => {
		let char = findById(player.controlled, outcome.charId);
		if (!char) {
			return Promise.reject(`${outcome.charId} not controlled`);
		}
		// Combine global and character specific teleport nodes.
		// Exclude nodes leading to the current room.
		let nodes = this.globalTeleports.toArray().concat(char.nodes.toArray()).filter(n => n.room.id != char.inRoom.id && (!this.allowedDestinations || this.allowedDestinations.indexOf(n.key) >= 0));
		if (!nodes.length) {
			return Promise.reject(`char ${char.name} ${char.surname} has no valid teleport nodes`);
		}

		let node = nodes[Math.floor(Math.random() * nodes.length)];
		return char.call('teleport', { nodeId: node.id })
			.then(() => `${char.name} ${char.surname} used teleport ${node.key}`);
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
