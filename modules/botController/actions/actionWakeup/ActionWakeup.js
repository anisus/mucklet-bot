import setParams from '#utils/setParams.js';

/**
 * ActionWakeup parameters.
 * @typedef {Object} ActionWakeup~Params
 * @property {number} [probability] Probability of the action to occur.
 * @property {number} [delay] Delay in milliseconds to wait prior to executing the action.
 * @property {number} [postdelay] Delay in milliseconds to wait after executing the action.
 */

/**
 * ActionWakeup adds the action to wake up an existing character.
 */
class ActionWakeup {

	/**
	 * Creates a new ActionWakeup instance.
	 * @param {App} app Modapp App object.
	 * @param {ActionWakeup~Params} params Module parameters.
	 */
	constructor(app, params) {
		this.app = app;
		// Params
		setParams(this, params, {
			probability: { type: 'number' },
			delay: { type: 'number' },
			postdelay: { type: 'number' },
		});

		this.app.require([ 'botController', 'bot' ], this._init);
	}

	_init = (module) => {
		this.module = Object.assign({ self: this }, module);

		this.module.botController.addAction({
			id: 'wakeup',
			outcomes: this._outcomes,
			exec: this._exec,
		});

		// Ensure controlled character is also awake
		this.module.bot.getBotPromise().then(bot => {
			if (bot.controlled && bot.controlled.state == 'asleep') {
				this.module.botController.enqueue('wakeup', {
					priority: 10000
				});
			}
		})
	}

	_outcomes = (bot, state) => {
		if (!this.probability) return;

		let ctrl = bot.controlled;

		// Cannot wakeup/control chars if the char limit is already reached.
		if (ctrl && ctrl.state == 'awake') return;

		return {
			probability: this.probability,
			delay: this.delay,
			postdelay: this.postdelay,
		};
	}

	_exec = (bot, state, outcome) => {
		let ctrl = bot.controlled;
		if (ctrl && ctrl.state == 'awake') {
			return Promise.reject(`char already awake`);
		}

		return (ctrl
			? Promise.resolve(ctrl)
			: bot.call('controlChar')
		).then(ctrl => {
			return ctrl.call('wakeup')
				.then(() => `woke up ${ctrl.name} ${ctrl.surname}`)
		});
	}

	dispose() {
		this.module.botController.removeAction('wakeup');
	}

}

export default ActionWakeup;
