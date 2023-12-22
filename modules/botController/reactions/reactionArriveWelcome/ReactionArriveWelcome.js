import setParams from '#utils/setParams.js';
import generateText from '#utils/generateText.js';
import replaceTags from '#utils/replaceTags.js';
import { populationProbability } from '#utils/probability.js';

/**
 * ReactionArriveWelcome parameters.
 * @typedef {Object} ReactionArriveWelcome~Params
 * @property {object} [populationChance] Chances of welcoming arrivals, between 0 and 1, based on room population.
 * @property {number} [priority] Priority of the reply action.
 * @property {number} [wordLengthMin] Minimum number of words in a message. Ignored if phrases is set.
 * @property {number} [wordLengthMax] Maximum number of words in a message. Ignored if phrases is set.
 * @property {?Array.<string>} [phrases] An array of phrases to use as message. Null means random lorem ipsum.
 */

/**
 * ReactionArriveWelcome greets when traveling to a room with other characters.
 */
class ReactionArriveWelcome {

	/**
	 * Creates a new ReactionArriveWelcome instance.
	 * @param {App} app Modapp App object.
	 * @param {ReactionArriveWelcome~Params} params Module parameters.
	 */
	constructor(app, params) {
		this.app = app;
		// Params
		setParams(this, params, {
			populationChance: { type: '?object' },
			priority: { type: 'number', default: 150 },
			wordLengthMin: { type: 'number', default: 1 },
			wordLengthMax: { type: 'number', default: 12 },
			phrases: { type: '?array' },
		});

		this.app.require([ 'botController', 'personality', 'charEvents', 'actionPose' ], this._init);
	}

	_init = (module) => {
		this.module = Object.assign({ self: this }, module);

		this.module.charEvents.subscribe(this._onCharEvent);
	}

	_onCharEvent = (char, ev) => {
		if (!this.populationChance) return

		// Assert it is a travel event
		if (ev.type != 'arrive') {
			return;
		}
		// Randomize against chance
		if (Math.random() >= populationProbability(char.inRoom, this.populationChance)) {
			return;
		}

		let msg = this.phrases
			? this.phrases[Math.floor(Math.random() * this.phrases.length)]
			: generateText(this.wordLengthMin, this.wordLengthMax);

		this.module.actionPose.enqueue(replaceTags(msg, ev.char), this.priority);
	}

	dispose() {
		this.module.charEvents.unsubscribe(this._onCharEvent);
	}

}

export default ReactionArriveWelcome;
