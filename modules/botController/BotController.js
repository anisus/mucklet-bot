import { Collection, Model } from 'modapp-resource';
import toString from '#utils/toString.js';
import setParams from '#utils/setParams.js';

const STATE_PENDING = 'pending';
const STATE_DONE = 'done;'

/**
 * BotController parameters.
 * @typedef {Object} BotController~Params
 * @property {Array} [queue] Initial queue of actions when starting controller. Mainly for debug purpose.
 */

/**
 * BotController action outcome. The object may contain any additional properties used by the action to perform the outcome.
 * @typedef {Object} BotController~ActionOutcome
 * @property {number} [probability] Proportional chance that the outcome will be selected by the bot controller as the next action outsome.
 * @property {number} [delay] Delay in milliseconds before the action outcome is executed. Defaults to 0.
 * @property {number} [postdelay] Delay in milliseconds after the action outcome has been executed. Defaults to 0.
 * @property {number} [priority] Priority of the action outcome when queued. A higher priority outcome will be executed before lower priority outcomes. Defaults to 1.
 */

/**
 * BotController is the central module for creating an autonomous, self acting
 * bot. Other modules may register actions that the bot controller may tell the
 * bot-character to perform.
 */
class BotController {

	/**
	 * Creates a new BotController instance.
	 * @param {App} app Modapp App object.
	 * @param {BotController~Params} params Module parameters.
	 */
	constructor(app, params) {
		this.app = app;
		// Params
		setParams(this, params, {
			queue: { type: 'array' },
		});

		this.app.require([ 'bot' ], this._init);
	}

	_init = (module) => {
		this.module = Object.assign({ self: this }, module);

		this.model = new Model({ data: { bot: null, state: null }, eventBus: this.app.eventBus });
		this.actions = new Collection({ idAttribute: m => m.id, eventBus: this.app.eventBus });
		this.bot = null;

		// Try to fetch bot model as soon as logged in.
		this.module.bot.getBotPromise().then(this._startController)
	}

	/**
	 * Outcomes callback This callback is displayed as a global member.
	 * @callback BotController~outcomesCallback
	 * @param {Model} bot Bot model.
	 * @param {object} state State object.
	 * @returns {(?BotController~ActionOutcome|Array.<BotController~ActionOutcome>)} Zero or more possible outcomes for the action.
	 */

	/**
	 * Execute callback called to execute an action outcome.
	 * @callback BotController~executeCallback
	 * @param {Model} bot Bot model.
	 * @param {object} state State object.
	 * @param {BotController~ActionOutcome} outcome Outcome to execute.
	 * @returns {(?string|Promise.<?string>)} Optional string to log, or promise of a string to log. If the promise rejects, it will be logged as an error.
	 */

	/**
	 * Register an action that may be performed by the controller.
	 * @param {object} action Action definition object.
	 * @param {string} action.id Action ID.
	 * @param {BotController~outcomesCallback} action.outcomes Callback that returns an array of possible outcomes.
	 * @param {BotController~executeCallback} action.exec Callback that executes one of the action outcomes.
	 * @returns {this}
	 */
	addAction(action) {
		if (this.actions.get(action.id)) {
			throw new Error("Action ID already registered: ", action.id);
		}

		this.actions.add(action);
		return this;
	}

	/**
	 * Unregisters a previously registered action.
	 * @param {string} actionId Action ID.
	 * @returns {this}
	 */
	removeAction(actionId) {
		this.actions.remove(actionId);
		return this;
	}

	/**
	 * Queues an outcome for an action.
	 * @param {string} action.id Action ID.
	 * @param {BotController~ActionOutcome} outcome Action outcome to queue.
	 */
	enqueue(actionId, outcome) {
		this._enqueue(actionId, outcome);
	}

	_startController = (bot) => {
		this.model.set({ bot });

		this._runPendingAction();
	}

	_queueNextAction() {
		// Loop through actions to get possible outcomes
		let outcomes = [];
		let totalProbability = 0;

		for (let action of this.actions) {
			let os = action.outcomes
				? action.outcomes(this.model.bot, this.model.state)
				: null;
			if (os) {
				os = Array.isArray(os) ? os : [os];
				for (let i = 0; i < os.length; i++) {
					let o = os[i];
					let probability = o.probability || 0;
					if (probability) {
						totalProbability += probability;
						outcomes.push({ actionId: action.id, outcome: o });
					}
				}
			}
		}

		if (!totalProbability) {
			console.log("No actions to perform. Idling.");
			return;
		}

		let rand = Math.random() * totalProbability;
		let summedProbability = 0;
		let o = null;
		for (let i = 0; i < outcomes.length; i++) {
			let ov = outcomes[i];
			if (ov.outcome && ov.outcome.probability) {
				o = ov;
				summedProbability += ov.outcome.probability;
				if (summedProbability > rand) {
					break;
				}
			}
		}

		o.state = STATE_PENDING;
		this._enqueue(o.actionId, o.outcome);
	}

	_enqueue(actionId, outcome) {
		let o = {
			actionId,
			outcome,
			state: STATE_PENDING,
			delay: outcome.delay || 0,
			postdelay: outcome.postdelay || 0,
			priority: typeof outcome.priority == 'number' ? outcome.priority : 1,
		};

		let len = this.queue.length;
		let prio = o.priority;
		let i = 0;
		while (i < len) {
			let no = this.queue[i];
			if (prio > no.priority) {
				break;
			}
			i++;
		}

		if (i == 0) {
			this._stopTimer();
		}
		this.queue.splice(i, 0, o);
		if (i == 0) {
			this._startTimer();
		}
	}

	_runPendingAction() {
		if (!this.queue.length) {
			this._queueNextAction();
		} else {
			this._startTimer();
		}
	}

	_stopTimer() {
		// Quick exit if no timer is running
		if (!this.timer) {
			return;
		}

		let diff = (new Date()).getTime() - this.timerStarted.getTime();
		clearTimeout(this.timer);

		this.timerStarted = null;
		this.timer = null;

		if (!this.queue.length) {
			throw new Error("Empty queue with running timer");
		}

		let o = this.queue[0];

		// Decrease timers with currently spend time.
		if (o.state == STATE_PENDING) {
			o.delay -= Math.min(diff, o.delay);
			console.debug(o.actionId + ": pausing delay with " + Math.floor(o.delay / 1000) + " seconds left");
		} else {
			o.postdelay -= Math.min(diff, o.postdelay);
			console.debug(o.actionId + ": pausing postdelay with " + Math.floor(o.postdelay / 1000) + " seconds left");
		}
	}

	_startTimer() {
		// Exit if timer is already running, or we have nothing in queue
		if (this.timer || !this.queue.length) return;

		let o = this.queue[0];
		let delay = (o.state == STATE_PENDING ?  o.delay : o.postdelay) || 0;
		if (delay) {
			if (o.state == STATE_PENDING) {
				console.debug(o.actionId + ": delay for " + Math.floor(delay / 1000) + " seconds");
			} else {
				console.debug(o.actionId + ": postdelay for " + Math.floor(delay / 1000) + " seconds");
			}
			this.timerStarted = new Date();
			this.timer = setTimeout(() => this._onTimeout(o), delay);
		} else {
			this._onTimeout(o);
		}
	}

	_onTimeout(o) {
		// Assert it is the correct action in first in queue.
		if (this.queue[0] != o) {
			console.error("Unexpected action first in queue. Expected:\n", o, "\nbut got:\n", this.queue[0]);
			return;
		}

		this.timerStarted = null;
		this.timer = null;

		if (o.state != STATE_DONE) {
			o.delay = 0;

			let action = this.actions.get(o.actionId);
			// Execute the action, and if it is successful, start the postdelay timer.
			if (action) {
				return Promise.resolve(action.exec ? action.exec(this.model.bot, this.model.state, o.outcome) : null)
					.then(result => {
						if (result) {
							console.debug(o.actionId + ":", toString(result))
						}
						o.state = STATE_DONE;
						this._startTimer(o);
					})
					.catch(err => {
						console.debug(o.actionId + ":", toString(err));
						this._shiftQueue();
					});
			}
		}

		this._shiftQueue();
	}

	_shiftQueue() {
		// Remove the action from the queue
		this.queue.shift();
		// Try to run next action
		this._runPendingAction();
	}

	dispose() {}

}

export default BotController;
