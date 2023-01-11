import setParams from '#utils/setParams.js';
import findById from '#utils/findById.js';
import generateText from '#utils/generateText.js';
import { populationProbability } from '#utils/probability.js';

/**
 * ActionSay parameters.
 * @typedef {Object} ActionSay~Params
 * @property {object} [populationProbability] Probabilities of the action to occur based on room population.
 * @property {number} [delay] Additional delay in milliseconds to wait prior to executing the action.
 * @property {number} [postdelay] Delay in milliseconds to wait after executing the action.
 * @property {number} [wordLengthMin] Minimum number of words in a message. Ignored if phrases is set.
 * @property {number} [wordLengthMax] Maximum number of words in a message. Ignored if phrases is set.
 * @property {?Array.<string>} [phrases] An array of phrases to use as message. Null means random lorem ipsum.
 */

/**
 * ActionSay adds the action to speak in a room with other characters.
 */
class ActionSay {

	/**
	 * Creates a new ActionSay instance.
	 * @param {App} app Modapp App object.
	 * @param {ActionSay~Params} params Module parameters.
	 */
	constructor(app, params) {
		this.app = app;
		// Params
		setParams(this, params, {
			populationProbability: { type: '?object' },
			delay: { type: 'number' },
			postdelay: { type: 'number' },
			wordLengthMin: { type: 'number', default: 2 },
			wordLengthMax: { type: 'number', default: 100 },
			phrases: { type: '?array' },
		});

		this.app.require([ 'botController', 'personality' ], this._init);
	}

	_init = (module) => {
		this.module = Object.assign({ self: this }, module);

		this.module.botController.addAction({
			id: 'say',
			outcomes: this._outcomes,
			exec: this._exec,
		});
	}

	/**
	 * Enqueues a say action to the botController.
	 * @param {string} msg Message to say.
	 * @param {number} priority Priority of the action.
	 */
	enqueue(msg, priority) {
		this.module.botController.enqueue('say', {
			msg,
			delay: this.delay + this.module.personality.calculateTypeDuration(msg),
			postdelay: this.postdelay,
			priority
		});
	}

	_outcomes = (bot, state) => {
		if (!this.populationProbability) return;

		let ctrl = bot.controlled;

		// Assert we have a controlled character in a non-quiet room.
		if (!ctrl || !ctrl.inRoom || ctrl.inRoom.isQuiet) return;

		let msg = this.phrases
			? this.phrases[Math.floor(Math.random() * this.phrases.length)]
			: generateText(this.wordLengthMin, this.wordLengthMax);

		return {
			msg,
			probability: populationProbability(ctrl.inRoom, this.populationProbability),
			delay: this.delay + this.module.personality.calculateTypeDuration(msg),
			postdelay: this.postdelay,
		};
	}

	_exec = (bot, state, outcome) => {
		let ctrl = bot.controlled;
		if (!ctrl) {
			return Promise.reject(`char not controlled`);
		}

		return ctrl.call('say', { msg: outcome.msg })
			.then(() => `${ctrl.name} ${ctrl.surname} spoke`);
	}

	dispose() {
		this.module.botController.removeAction('say');
	}

}

export default ActionSay;
