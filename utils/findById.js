/**
 * Finds the first object with a matching id property in an iterable.
 * @param {Array|Collection} list Iterable list of objects
 * @param {string} id ID property of object
 * @returns {?object} Object with matching id property, or null.
 */
export default function findById(list, id) {
	if (list) {
		for (let o of list) {
			if (o && typeof o == 'object' && o.id == id) {
				return o;
			}
		}
	}
	return null;
}
