/**
 * Calculates a probability based on the population of the room.
 *
 * It uses a population probability object, where the keys are the population,
 * and value is the probability for that population. Any population in between
 * will have the probability calculated with linear proportion.
 * @param {Model} room Room model
 * @param {object} prob Population probability object.
 * @returns {number} Probability
 */
export function populationProbability(room, prob) {
	return probability(
		room && room.chars
			? room.chars.toArray().filter(c => c.state == 'awake').length
			: 0,
		prob
	);
}

/**
 * Calculates a probability based on a count and a probability object.
 * @param {number} count Count
 * @param {object} prob Probability object.
 * @returns {number} Probability
 */
export default function probability(count, prob) {
	let list = Object.keys(prob)
		.map(k => ({ count: Number(k), prob: Number(prob[k]) }))
		.sort((a, b) => a.count - b.count);

	if (!list.length) {
		return 0;
	}

	let o = list[0];
	if (o.count >= count) {
		return o.prob;
	}

	for (let i = 1; i < list.length; i++) {
		let no = list[i];
		if (no.count >= count) {
			let prog = (count - o.count) / (no.count - o.count);
			return o.prob * (1 - prog) + no.prob * prog;
		}
		o = no;
	}

	return o.prob;
}

