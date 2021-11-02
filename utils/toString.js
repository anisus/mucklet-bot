import l10nImport from 'modapp-l10n';
const l10n = l10nImport.default;

/**
 * Converts a value such as a ResError, an object with a message property, or
 * other values to a string.
 * @param {*} v Value
 * @returns {string} String
 */
export default function errorString(v) {
	if (v && typeof v == 'object') {
		return v.code
			? l10n.t(v.code, v.message, v.data)
			: v.hasOwnProperty('message')
				? v.message
				: JSON.stringify(v);
	}

	return typeof v == 'string' ? v : JSON.stringify(v);
}
