import path from 'path';
import glob from 'glob';
import url from 'url';

/**
 * Loads modules by recusively scanning a folder for js-files with the same name
 * as its containing folder (case-insensitive). Example:
 *
 *   nested/path/login/Login.js
 *
 * It returns a promise of an object where the keys are the camel-cased version
 * of the file name, and the value is the files default class.
 *
 * @param {string} folder Path to the folder to scan
 * @returns {Promise.<object>} Promise of an module object.
 */
export default function loadModules(folder) {
	let modules = {};

	let promises = [];
	glob.sync(path.join(path.resolve(), folder, "*/**/*.js")).forEach(file => {
			let match = file.match(/\/([^/]*)\/(\1).m?js$/i);
			if (match) {
				let name = match[2].charAt(0).toLowerCase() + match[2].slice(1);
				if (modules[name]) {
					throw new Error(`duplicate module: ${name} (${file})`);
				}

				modules[name] = true;
				promises.push(import(url.pathToFileURL(file)).then(result => {
					if (result.default) {
						modules[name] = result.default;
					} else {
						delete modules[name];
					}
				}));
			}
	});

	return Promise.all(promises).then(() => modules);
}
