import seedrandom from 'seedrandom';
import setParams from '#utils/setParams.js';

/**
 * ActionCreateChar parameters.
 * @typedef {Object} ActionCreateChar~Params
 * @property {number} [charLimit] Limit on how many characters are totally created.
 * @property {number} [probability] Probability of the action to occur.
 * @property {number} [delay] Delay in milliseconds to wait prior to executing the action.
 * @property {number} [postdelay] Delay in milliseconds to wait after executing the action.
 */

/**
 * ActionCreateChar adds the action to create a character if the limit is not reached.
 */
class ActionCreateChar {

	/**
	 * Creates a new ActionCreateChar instance.
	 * @param {App} app Modapp App object.
	 * @param {ActionCreateChar~Params} params Module parameters.
	 */
	constructor(app, params) {
		this.app = app;
		// Params
		setParams(this, params, {
			charLimit: { type: 'number', default: 1 },
			probability: { type: 'number' },
			delay: { type: 'number' },
			postdelay: { type: 'number' },
		});

		this.app.require([ 'botController' ], this._init);
	}

	_init = (module) => {
		this.module = Object.assign({ self: this }, module);

		this.module.botController.addAction({
			id: 'createChar',
			outcomes: this._outcomes,
			exec: this._exec,
		});
	}

	_outcomes = (player, state) => {
		if (!this.probability) return;

		// Cannot create chars if the char limit is already reached.
		if (player.chars.length >= this.charLimit) return;

		return {
			delay: this.delay,
			postdelay: this.postdelay,
			probability: this.probability
		};
	}

	_exec = (player, state, outcome) => {
		let rng = seedrandom(player.getResourceId() + '_' + player.chars.length);
		let name = "Bot-" + rng().toString(36).substr(2, 4).toUpperCase();
		let surname = "Model " + rng().toString(36).substr(2, 2).toUpperCase();

		return player.call('createChar', { name, surname })
			.then(() => `created bot ${name} ${surname}`);
	}

	dispose() {
		this.module.botController.removeAction('createChar');
	}

}

export default ActionCreateChar;
