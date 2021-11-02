const typeDefaults = {
	'string': "",
	'?string': null,
	'number': 0,
	'?number': null,
	'bool': false,
	'?bool': null,
	'array': () => ([]),
	'?array': null,
	'object': () => ({}),
	'?object': null,
	'*': null
};

const booleanFalse = [ 'no', 'false', '0' ];

/**
 * Sets module params.
 * @param {object} obj Object to set the parsed params to.
 * @param {object} params Params object passed to the constructor.
 * @param {object} def Definition object.
 * @returns {object} Returns the obj argument.
 */
export default function setParams(obj, params, def) {
	for (let k in def) {
		let d = def[k];
		let type = d.type || '*';

		if (!typeDefaults.hasOwnProperty(type)) {
			throw new Error("Unknown type: ", type);
		}

		let v;
		if (params.hasOwnProperty(k)) {
			v = params[k];
			if (type.substr(0, 1) != '?' || v !== null) {
				switch (type) {
					case 'string':
					case '?string':
						v = String(v);
						break;
					case '?number':
					case 'number':
						v = Number(v);
						break;
					case 'bool':
					case '?bool':
						v = typeof v == 'string' ? booleanFalse.indexOf(v.toLowerCase()) == -1 : !!v;
						break;
					case 'array':
					case '?array':
						v = Array.isArray(v) ? v : [ v ];
						break;
					case 'object':
					case '?object':
						if (typeof v !== 'object') {
							console.error("Invalid params object: ", v);
						}
						break;
				}
			}
		} else {
			v = d.hasOwnProperty('default') ? d.default : typeDefaults[type]
		}

		if (typeof v == 'function') {
			v = v();
		}
		obj[k] = v;
	}

	return obj;
}
