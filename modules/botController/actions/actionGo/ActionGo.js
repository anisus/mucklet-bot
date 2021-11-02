import setParams from '#utils/setParams.js';
import findById from '#utils/findById.js';
import { populationProbability } from '#utils/probability.js';

/**
 * ActionGo parameters.
 * @typedef {Object} ActionGo~Params
 * @property {object} [populationProbability] Probabilities of the action to occur based on room population.
 * @property {number} [delay] Delay in milliseconds to wait prior to executing the action.
 * @property {number} [postdelay] Delay in milliseconds to wait after executing the action.
 */

/**
 * ActionGo adds the action to go around using exits.
 */
class ActionGo {

	/**
	 * Creates a new ActionGo instance.
	 * @param {App} app Modapp App object.
	 * @param {ActionGo~Params} params Module parameters.
	 */
	constructor(app, params) {
		this.app = app;
		// Params
		setParams(this, params, {
			populationProbability: { type: 'object', default: { // 0: 1 }},
				1: 100,
				2: 20,
				3: 5,
				10: 1,
				20: 5,
				80: 100
			}},
			delay: { type: 'number', default: 1000 },
			postdelay: { type: 'number', default: 2000 },
		});

		this.app.require([ 'botController' ], this._init);
	}

	_init = (module) => {
		this.module = Object.assign({ self: this }, module);

		this.module.botController.addAction({
			id: 'go',
			outcomes: this._outcomes,
			exec: this._exec,
		});
	}

	_outcomes = (player, state) => {
		let chars = player.controlled.toArray()
			.filter(m => this.module.botController.validChar(m.id) && m.inRoom.exits.length);
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
		let exits = char.inRoom.exits;
		if (!exits.length) {
			return Promise.reject(`room ${char.inRoom.name} has no visible exits`);
		}

		let exit = exits.atIndex(Math.floor(Math.random() * exits.length));
		return char.call('useExit', { exitId: exit.id })
			.then(() => `${char.name} ${char.surname} used exit ${exit.keys[0]}`);
	}

	dispose() {
		this.module.botController.removeAction('go');
	}

}

export default ActionGo;
