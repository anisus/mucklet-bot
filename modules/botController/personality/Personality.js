import setParams from '#utils/setParams.js';

/**
 * Personality parameters.
 * @typedef {Object} Personality~Params
 * @property {number} [typeSpeed] Type speed in characters per minute.
 * @property {number} [readSpeed] Read speed in characters per minute.
 */

/**
 * Personality holds common personality traits that an action can use to
 * determine behavior.
 */
class Personality {

	/**
	 * Creates a new Personality instance.
	 * @param {App} app Modapp App object.
	 * @param {Personality~Params} params Module parameters.
	 */
	constructor(app, params) {
		this.app = app;
		// Params
		setParams(this, params, {
			typeSpeed: { type: 'number', default: 200 },
			readSpeed: { type: 'number', default: 1000 },
		});
	}

	/**
	 * Calculates the time it takes in milliseconds to type a message.
	 * @param {string} msg Message to type.
	 * @returns {number} Duration in milliseconds.
	 */
	calculateTypeDuration(msg) {
		return 60 * 1000 * msg.length / this.typeSpeed;
	}

	/**
	 * Calculates the time it takes in milliseconds to read a message.
	 * @param {string} msg Message to read.
	 * @returns {number} Duration in milliseconds.
	 */
	calculateReadDuration(msg) {
		return 60 * 1000 * msg.length / this.readSpeed;
	}

	dispose() {}

}

export default Personality;
