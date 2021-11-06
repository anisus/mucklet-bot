import setParams from '#utils/setParams.js';

/**
 * ActionIdle parameters.
 * @typedef {Object} ActionIdle~Params
 * @property {number} [probability] Probability of the action to occur.
 * @property {number} [delayMin] Minimum time in milliseconds to idle.
 * @property {number} [delayMax] Maximum time in milliseconds to idle.
 * @property {string} [spread] How the random values are spread. May be 'linear', 'cube' (less high values), or 'square' (even less high values).
 */

/**
 * ActionIdle adds the action to idle with awake characters.
 */
class ActionIdle {

	/**
	 * Creates a new ActionIdle instance.
	 * @param {App} app Modapp App object.
	 * @param {ActionIdle~Params} params Module parameters.
	 */
	constructor(app, params) {
		this.app = app;
		// Params
		setParams(this, params, {
			probability: { type: 'number' },
			delayMin: { type: 'number', default: 1000 },
			delayMax: { type: 'number', default: 5000 },
			spread: { type: 'string', default: 'linear' },
		});

		this.app.require([ 'botController' ], this._init);
	}

	_init = (module) => {
		this.module = Object.assign({ self: this }, module);

		this.module.botController.addAction({
			id: 'idle',
			outcomes: this._outcomes,
			exec: this._exec,
		});
	}

	_outcomes = (player, state) => {
		if (!this.probability) return;

		let chars = player.controlled.toArray()
			.filter(m => this.module.botController.validChar(m.id));
		// Idling can only be done with characters awake, else it is lurking
		if (!chars.length) return;

		return {
			delay: this.delayMin + Math.floor(Math.random() * (this.delayMax - this.delayMin)),
			probability: this.probability
		};
	}

	_exec = (player, state, outcome) => {}


	dispose() {
		this.module.botController.removeAction('idle');
	}

}

export default ActionIdle;
