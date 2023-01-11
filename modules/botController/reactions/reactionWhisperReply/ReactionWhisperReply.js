import setParams from '#utils/setParams.js';
import generateText from '#utils/generateText.js';

/**
 * ReactionPrivateReply parameters.
 * @typedef {Object} ReactionPrivateReply~Params
 * @property {object} [chance] Chance of replying, between 0 and 1.
 * @property {number} [priority] Priority of the action.
 * @property {number} [wordLengthMin] Minimum number of words in a message. Ignored if phrases is set.
 * @property {number} [wordLengthMax] Maximum number of words in a message. Ignored if phrases is set.
 * @property {?Array.<string>} [phrases] An array of phrases to use as message. Null means random lorem ipsum.
 */

/**
 * ReactionPrivateReply reacts to whispers and enqueues a whisper reply.
 */
class ReactionPrivateReply {

	/**
	 * Creates a new ReactionPrivateReply instance.
	 * @param {App} app Modapp App object.
	 * @param {ReactionPrivateReply~Params} params Module parameters.
	 */
	constructor(app, params) {
		this.app = app;
		// Params
		setParams(this, params, {
			chance: { type: 'number' },
			priority: { type: 'number', default: 100 },
			wordLengthMin: { type: 'number', default: 2 },
			wordLengthMax: { type: 'number', default: 100 },
			phrases: { type: '?array' },
		});

		this.app.require([ 'charEvents', 'actionWhisper' ], this._init);
	}

	_init = (module) => {
		this.module = Object.assign({ self: this }, module);

		this.module.charEvents.subscribe(this._onCharEvent);
	}

	_onCharEvent = (char, ev) => {
		if (!this.chance) return

		// Assert it is one of the event types affected by read
		if (ev.type != 'whisper') {
			return;
		}
		// Not replying to own messages
		if (ev.char.id == char.id) {
			return;
		}
		// Randomize against chance
		if (Math.random() >= this.chance) {
			return;
		}

		let msg = this.phrases
			? this.phrases[Math.floor(Math.random() * this.phrases.length)]
			: generateText(this.wordLengthMin, this.wordLengthMax);
		let pose = msg[0] == ':';
		if (pose) {
			msg = msg.slice(1);
		}

		this.module.actionWhisper.enqueue(ev.char.id, msg, pose, this.priority);
	}

	dispose() {
		this.module.charEvents.unsubscribe(this._onCharEvent);
	}

}

export default ReactionPrivateReply;
