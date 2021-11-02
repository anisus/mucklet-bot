/**
 * Generates a random integer value within a span, optionally using a spread.
 * @param {number} [from] From value.
 * @param {number} [to] To value.
 * @param {string} [spread] How to spread the random. May be 'linear', 'square', 'cube'. Defaults to 'linear'.
 * @returns {number} Random integer.
 */
export default function randomInt(from, to, spread) {
	let r = Math.random();
	switch (spread) {
		case 'square':
			r = r * r;
			break;
		case 'cube':
			r = r * r * r;
			break;
	}

	return from + Math.floor(r * (to - from));
}
