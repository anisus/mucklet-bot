/**
 * Parses the argument flags. Each flag should start with a single or double
 * dash, and be separated by the value with an equal sign with no surrounding
 * spaces, or a space. The flag name is a dot-separated path to the module's
 * config. Example:
 *
 *     --login.user=accipiter --login.pass=secret
 *     -api.hostUrl https://api.example.com
 *
 * All the remaining arguments that is not part of a flag will be interpreted as
 * a config path.
 *
 * @param {Array.<string>} args Arguments passed by the command line, excluding
 * the node command and index.js
 * @param {string} [prefix] Optional prefix that all module flags should start
 * with. Eg. "mod." would give "--mod.login.user=accipiter"
 * @returns {object} Object with the properties { config, path }
 */

export default function parseArgs(args, prefix) {
	let config = {};
	let path = '';

	let i = 0;
	let len = args.length;
	for (i = 0; i < len; i++) {
		let m = args[i].match(/^--?([^=]*)(=.*)?/);

		// Not an option following the pattern --option[=value]
		// We assume it is instead part of config path
		if (!m) break;

		// Did we get an equal sign?
		let key = m[1];
		let value = m[2] || '';
		if (!value) {
			// Get value from the follow up argument
			if (i + 1 < len && !args[i + 1].match(/^--?/)) {
				i++;
				value = args[i];
			}
		} else {
			// Remove the equal sign
			value = value.slice(1);
		}

		// Validate key
		if (prefix) {
			if (!key.startsWith(prefix)) {
				throw new Error("Invalid command flag: " + key);
			}
			key = key.slice(prefix.length);
		}

		let parts = key.split('.');

		let o = config;
		for (let j = 0; j < parts.length; j++) {
			let part = parts[j];
			if (!part) continue;

			if (j == parts.length - 1) {
				o[part] = value;
			} else {
				if (typeof o[part] !== 'object') o[part] = {};
				o = o[part];
			}
		}
	}

	// The remaining arguments makes up the path
	for (; i < len; i++) {
		path += (path ? ' ' : '') + args[i];
	}

	return { config, path };
}
