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
			populationProbability: { type: '?object' },
			delay: { type: 'number' },
			postdelay: { type: 'number' },
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

	_outcomes = (bot, state) => {
		if (!this.populationProbability) return;

		let ctrl = bot.controlled;

		// Assert we have a controlled character in rooms with exits.
		if (!ctrl || !ctrl.inRoom?.exits.length) return;

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
		let exits = ctrl.inRoom.exits;
		if (!exits.length) {
			return Promise.reject(`room ${ctrl.inRoom.name} has no visible exits`);
		}

		let exit = exits.atIndex(Math.floor(Math.random() * exits.length));
		return ctrl.call('useExit', { exitId: exit.id })
			.then(() => `${ctrl.name} ${ctrl.surname} used exit ${exit.keys[0]}`);
	}

	dispose() {
		this.module.botController.removeAction('go');
	}

}

export default ActionGo;
