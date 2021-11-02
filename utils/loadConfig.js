import fs from 'fs';
import url from 'url';

/**
 * Loads configuration either from a .js or .mjs file, or by falling back to
 * parsing the file as JSON.
 *
 * If no file path is provided, null is returned.
 * @param {string} [path] Path to the config file.
 * @returns {Promise.<?object>} Promise of a config object.
 */
export default function loadConfig(path) {
	return Promise.resolve(path
		? path.match(/\.m?js$/)
			? import(url.pathToFileURL(path)).then(result => result.default || result)
			: JSON.parse(fs.readFileSync(path, 'utf8'))
		: null
	);
}
