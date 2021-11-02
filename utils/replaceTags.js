/**
 * Replaces named {tags} within a string with properties from an object.
 * @param {string} string String.
 * @param {object} data Data object.
 * @returns {string} String with tags replaced with data object values.
 */
export default function replaceTags(str, data) {
	return str.replace(/{([^}]+)}/g, function (match, idx) {
		return typeof data[idx] != 'undefined' ?
			String(data[idx]) :
			'???';
	});
}
