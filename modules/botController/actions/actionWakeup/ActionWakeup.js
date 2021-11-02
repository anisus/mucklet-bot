import setParams from '#utils/setParams.js';
import findById from '#utils/findById.js';

/**
 * ActionWakeup parameters.
 * @typedef {Object} ActionWakeup~Params
 * @property {number} [charLimit] Limit on how many characters to have awake at any single time.
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
			charLimit: { type: 'number', default: 1 },
			probability: { type: 'number', default: 1 },
			delay: { type: 'number', default: 1000 },
			postdelay: { type: 'number', default: 2000 },
		});

		this.app.require([ 'botController', 'player' ], this._init);
	}

	_init = (module) => {
		this.module = Object.assign({ self: this }, module);

		this.module.botController.addAction({
			id: 'wakeup',
			outcomes: this._outcomes,
			exec: this._exec,
		});

		// Ensure controlled characters are also awake
		this.module.player.getPlayerPromise().then(player => {
			player.controlled.toArray()
				.filter(m => this.module.botController.validChar(m.id) && m.state == 'asleep')
				.forEach(c => {
					this.module.botController.enqueue('wakeup', {
						charId: c.id,
						priority: 10000
					});
				});
		})
	}

	_outcomes = (player, state) => {
		let chars = player.controlled.toArray()
			.filter(m => this.module.botController.validChar(m.id));
		// Cannot wakeup/control chars if the char limit is already reached.
		if (chars.length >= this.charLimit) return;

		let outcomes = [];
		for (let c of player.chars) {
			if (c.state == 'asleep') {
				if (this.module.botController.validChar(c.id)) {
					outcomes.push({
						charId: c.id,
						delay: this.delayMin + Math.floor(Math.random() * (this.delayMax - this.delayMin)),
						postdelay: this.postdelayMin + Math.floor(Math.random() * (this.postdelayMax - this.postdelayMin)),
					});
				}
			}
		}

		outcomes.forEach(m => m.probability = 1 / outcomes.length);
		return outcomes.length ? outcomes : null;
	}

	_exec = (player, state, outcome) => {
		let char = findById(player.controlled, outcome.charId);
		if (char && char.state == 'awake') {
			return Promise.reject(`${char.name} ${char.surname} already awake`);
		}
		return (char
			? Promise.resolve(char)
			: player.call('controlChar', { charId: outcome.charId })
		)
			.then(char => {
				return char.call('wakeup')
					.then(() => `woke up ${char.name} ${char.surname}`)
			});
	}

	dispose() {
		this.module.botController.removeAction('wakeup');
	}

}

export default ActionWakeup;
