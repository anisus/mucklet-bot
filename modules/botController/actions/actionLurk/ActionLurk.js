import setParams from '#utils/setParams.js';

/**
 * ActionLurk parameters.
 * @typedef {Object} ActionLurk~Params
 * @property {number} [probability] Probability of the action to occur.
 * @property {number} [delayMin] Minimum time in milliseconds to lurk.
 * @property {number} [delayMax] Maximum time in milliseconds to lurk.
 */

/**
 * ActionLurk adds the action to lurk for a while, without having any awake
 * characters.
 */
class ActionLurk {

	/**
	 * Creates a new ActionLurk instance.
	 * @param {App} app Modapp App object.
	 * @param {ActionLurk~Params} params Module parameters.
	 */
	constructor(app, params) {
		this.app = app;
		// Params
		setParams(this, params, {
			probability: { type: 'number' },
			delayMin: { type: 'number', default: 2000 },
			delayMax: { type: 'number', default: 5000 }
		});

		this.app.require([ 'botController' ], this._init);
	}

	_init = (module) => {
		this.module = Object.assign({ self: this }, module);

		this.module.botController.addAction({
			id: 'lurk',
			outcomes: this._outcomes,
			exec: this._exec,
		});
	}

	_outcomes = (bot, state) => {
		if (!this.probability) return;

		let ctrl = bot.controlled;

		// Lurking can only be done with character not controlled, else it is idling
		if (ctrl) return;

		return {
			delay: this.delayMin + Math.floor(Math.random() * (this.delayMax - this.delayMin)),
			probability: this.probability
		};
	}

	_exec = (bot, state, outcome) => {}

	dispose() {
		this.module.botController.removeAction('lurk');
	}

}

export default ActionLurk;
