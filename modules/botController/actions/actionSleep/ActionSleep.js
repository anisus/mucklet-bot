import setParams from '#utils/setParams.js';
import findById from '#utils/findById.js';

/**
 * ActionSleep parameters.
 * @typedef {Object} ActionSleep~Params
 * @property {number} [probability] Probability of the action to occur.
 * @property {number} [delay] Delay in milliseconds to wait prior to executing the action.
 * @property {number} [postdelay] Delay in milliseconds to wait after executing the action.
 */

/**
 * ActionSleep adds the action to put a character to sleep.
 */
class ActionSleep {

	/**
	 * Creates a new ActionSleep instance.
	 * @param {App} app Modapp App object.
	 * @param {ActionSleep~Params} params Module parameters.
	 */
	constructor(app, params) {
		this.app = app;
		// Params
		setParams(this, params, {
			probability: { type: 'number' },
			delay: { type: 'number' },
			postdelay: { type: 'number' },
		});

		this.app.require([ 'botController' ], this._init);
	}

	_init = (module) => {
		this.module = Object.assign({ self: this }, module);

		this.module.botController.addAction({
			id: 'sleep',
			outcomes: this._outcomes,
			exec: this._exec,
		});
	}

	_outcomes = (bot, state) => {
		if (!this.probability) return;

		let ctrl = bot.controlled;

		// Assert we have a controlled character to put to sleep.
		if (!ctrl || ctrl.state != 'awake') return;

		return {
			probability: this.probability,
			delay: this.delay,
			postdelay: this.postdelay,
		};
	}

	_exec = (bot, state, outcome) => {
		let ctrl = bot.controlled;
		if (!ctrl) {
			return Promise.reject(`char not controlled`);
		}
		return ctrl.call('release')
			.then(() => `${ctrl.name} ${ctrl.surname} put to sleep`);
	}

	dispose() {
		this.module.botController.removeAction('sleep');
	}

}

export default ActionSleep;
