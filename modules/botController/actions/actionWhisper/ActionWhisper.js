import setParams from '#utils/setParams.js';
import findById from '#utils/findById.js';
import generateText from '#utils/generateText.js';
import { populationProbability } from '#utils/probability.js';

/**
 * ActionWhisper parameters.
 * @typedef {Object} ActionWhisper~Params
 * @property {object} [populationProbability] Probabilities of the action to occur based on room population.
 * @property {number} [delay] Additional delay in milliseconds to wait prior to executing the action.
 * @property {number} [postdelay] Delay in milliseconds to wait after executing the action.
 * @property {?Array.<string>} [phrases] An array of phrases to use as message. Null means random lorem ipsum.
 * @property {?Array.<string>} [chars] An array of chars eligible to be whispered to. Null means any.
 */

/**
 * ActionWhisper adds the action to speak in a room with other characters.
 */
class ActionWhisper {

	/**
	 * Creates a new ActionWhisper instance.
	 * @param {App} app Modapp App object.
	 * @param {ActionWhisper~Params} params Module parameters.
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
			id: 'whisper',
			outcomes: this._outcomes,
			exec: this._exec,
		});
	}

	/**
	 * Enqueues a whisper action to the botController.
	 * @param {string} charId Character ID.
	 * @param {string} targetId  Target character ID.
	 * @param {string} msg Message to whisper.
	 * @param {boolean} pose Flag if message is posed.
	 * @param {number} priority Priority of the action.
	 */
	enqueue(charId, targetId, msg, pose, priority) {
		this.module.botController.enqueue('whisper', {
			charId: charId,
			targetId: targetId,
			msg,
			pose,
			delay: this.delay + this.module.personality.calculateTypeDuration(msg),
			postdelay: this.postdelay,
			priority
		});
	}

	_outcomes = (player, state) => {
		if (!this.populationProbability) return;

		let chars = player.controlled.toArray()
			.filter(m => this.module.botController.validChar(m.id)
				&& !m.inRoom.isQuiet
			);

		// Assert we have any controlled characters in non-quiet rooms.
		if (!chars.length) return;

		let outcomes = [];
		chars.forEach(c => {
			if (c.inRoom && c.inRoom.chars) {
				c.inRoom.chars.toArray()
					.filter(rc => rc.state == 'awake' && !findById(player.controlled, rc.id))
					.forEach(rc => {
						let msg = this.phrases
							? this.phrases[Math.floor(Math.random() * this.phrases.length)]
							: generateText(this.wordLengthMin, this.wordLengthMax);
						let pose = msg[0] == ':';
						if (pose) {
							msg = msg.slice(1);
						}
						outcomes.push({
							charId: c.id,
							targetId: rc.id,
							msg,
							pose,
							probability: populationProbability(c.inRoom, this.populationProbability),
							delay: this.delay + this.module.personality.calculateTypeDuration(msg),
							postdelay: this.postdelay,
						});
					})
			}
		});

		outcomes = outcomes.filter(o => o.probability);
		// Split probability into character count
		outcomes.forEach(o => o.probability = o.probability / outcomes.length);
		return outcomes;
	}

	_exec = (player, state, outcome) => {
		let char = findById(player.controlled, outcome.charId);
		if (!char) {
			return Promise.reject(`${outcome.charId} not controlled`);
		}
		let target = findById(char.inRoom && char.inRoom.chars, outcome.targetId);
		if (!target) {
			return Promise.reject(`target char no longer in room ${char.inRoom.name}`);
		}

		return char.call('whisper', { msg: outcome.msg, charId: target.id, pose: outcome.pose })
			.then(() => `${char.name} ${char.surname} whispered to ${target.name} ${target.surname}`);
	}

	dispose() {
		this.module.botController.removeAction('whisper');
	}

}

export default ActionWhisper;
