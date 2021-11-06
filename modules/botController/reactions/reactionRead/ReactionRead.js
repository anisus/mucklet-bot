import setParams from '#utils/setParams.js';

/**
 * ReactionRead parameters.
 * @typedef {Object} ReactionRead~Params
 * @property {object} [chance] Chance of reading, between 0 and 1.
 * @property {number} [priority] Priority of the read action.
 * @property {Array.<string>} [eventTypes] List of event types to read. Defaults to [ 'say', 'pose', 'ooc', 'describe' ].
 */

/**
 * ReactionRead intercepts with idle time to read whenever someone else speaks
 * in the room.
 */
class ReactionRead {

	/**
	 * Creates a new ReactionRead instance.
	 * @param {App} app Modapp App object.
	 * @param {ReactionRead~Params} params Module parameters.
	 */
	constructor(app, params) {
		this.app = app;
		// Params
		setParams(this, params, {
			chance: { type: 'number' },
			eventTypes: { type: 'array', default: [ 'say', 'pose', 'ooc', 'describe' ]},
			priority: { type: 'number', default: 100 },
		});

		this.app.require([ 'botController', 'personality', 'charEvents' ], this._init);
	}

	_init = (module) => {
		this.module = Object.assign({ self: this }, module);

		this.module.botController.addAction({
			id: 'read',
			exec: this._exec,
		});
		this.module.charEvents.subscribe(this._onCharEvent);
	}

	_onCharEvent = (char, ev) => {
		if (!this.chance) return

		// Assert it is one of the event types affected by read
		if (this.eventTypes.indexOf(ev.type) == -1) {
			return;
		}
		// Not reading own messages
		if (ev.char.id == char.id) {
			return;
		}
		// Randomize against chance
		if (Math.random() >= this.chance) {
			return;
		}

		this.module.botController.enqueue('read', {
			delay: this.module.personality.calculateReadDuration(ev.msg),
			priority: this.priority
		});
	}

	_exec = (player, state, outcome) => {
		return Promise.resolve('reading some text');
	}

	dispose() {
		this.module.botController.removeAction('read');
		this.module.charEvents.unsubscribe(this._onCharEvent);
	}

}

export default ReactionRead;
