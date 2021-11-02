import setParams from '#utils/setParams.js';
import findById from '#utils/findById.js';
import generateText from '#utils/generateText.js';
import { populationProbability } from '#utils/probability.js';

/**
 * ActionPose parameters.
 * @typedef {Object} ActionPose~Params
 * @property {object} [populationProbability] Probabilities of the action to occur based on room population.
 * @property {number} [delay] Additional delay in milliseconds to wait prior to executing the action.
 * @property {number} [postdelay] Delay in milliseconds to wait after executing the action.
 * @property {number} [wordLengthMin] Minimum number of words in a message. Ignored if phrases is set.
 * @property {number} [wordLengthMax] Maximum number of words in a message. Ignored if phrases is set.
 * @property {?Array.<string>} [phrases] An array of phrases to use as message. Null means random lorem ipsum.
 */

/**
 * ActionPose adds the action to pose in a room with other characters.
 */
class ActionPose {

	/**
	 * Creates a new ActionPose instance.
	 * @param {App} app Modapp App object.
	 * @param {ActionPose~Params} params Module parameters.
	 */
	constructor(app, params) {
		this.app = app;
		// Params
		setParams(this, params, {
			populationProbability: { type: 'object', default: { // 0: 1 }},
				0: 0,
				1: 20,
				2: 20,
				3: 40,
			}},
			delay: { type: 'number', default: 1000 },
			postdelay: { type: 'number', default: 2000 },
			wordLengthMin: { type: 'number', default: 2 },
			wordLengthMax: { type: 'number', default: 100 },
			phrases: { type: '?array' },
		});

		this.app.require([ 'botController', 'personality' ], this._init);
	}

	_init = (module) => {
		this.module = Object.assign({ self: this }, module);

		this.module.botController.addAction({
			id: 'pose',
			outcomes: this._outcomes,
			exec: this._exec,
		});
	}

	/**
	 * Enqueues a pose action to the botController.
	 * @param {string} charId Character ID.
	 * @param {string} msg Message to pose.
	 * @param {number} priority Priority of the action.
	 */
	enqueue(charId, msg, priority) {
		this.module.botController.enqueue('pose', {
			charId: charId,
			msg,
			delay: this.delay + this.module.personality.calculateTypeDuration(msg),
			postdelay: this.postdelay,
			priority
		});
	}

	_outcomes = (player, state) => {
		let chars = player.controlled.toArray()
			.filter(m => this.module.botController.validChar(m.id)
				&& !m.inRoom.isQuiet
			);

		// Assert we have any controlled characters in non-quiet rooms.
		if (!chars.length) return;

		let outcomes = chars
			.map(c => {
				let msg = this.phrases
					? this.phrases[Math.floor(Math.random() * this.phrases.length)]
					: generateText(this.wordLengthMin, this.wordLengthMax);
				return {
					charId: c.id,
					msg,
					probability: populationProbability(c.inRoom, this.populationProbability),
					delay: this.delay + this.module.personality.calculateTypeDuration(msg),
					postdelay: this.postdelay,
				};
			})
			.filter(o => o.probability);
		// Split probability into character count
		outcomes.forEach(o => o.probability = o.probability / outcomes.length);
		return outcomes;
	}

	_exec = (player, state, outcome) => {
		let char = findById(player.controlled, outcome.charId);
		if (!char) {
			return Promise.reject(`${outcome.charId} not controlled`);
		}

		return char.call('pose', { msg: outcome.msg })
			.then(() => `${char.name} ${char.surname} posed`);
	}

	dispose() {
		this.module.botController.removeAction('pose');
	}

}

export default ActionPose;
