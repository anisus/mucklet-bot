import { loremIpsum } from 'lorem-ipsum';
import randomInt from '#utils/randomInt.js';

/**
 * Generates a random nonsense text.
 * @param {number} [minWords] Minimum number of words. Defaults to 2.
 * @param {number} [maxWords] Maximum number of words. Defaults to 20.
 * @param {string} [spread] How to spread the length. May be 'linear', 'square', 'cube'. Defaults to 'cube'.
 * @returns {string} Random text.
 */
export default function generateText(minWords, maxWords, spread) {
	minWords = minWords || 2;
	maxWords = maxWords || 2;
	spread = spread || 'cube';
	let count = randomInt(minWords, maxWords, spread);
	return loremIpsum({ count, units: 'words' });
}
