import resclient from 'resclient';
import WebSocket from 'isomorphic-ws';
const ResClient = resclient.default;
const isResError = resclient.isResError
import setParams from '#utils/setParams.js';

const namespace = 'module.api';

/**
 * Api module connects to the backend api and provides low level
 * methods for service modules to send and receive data.
 */
class Api {

	constructor(app, params) {
		this.app = app;
		// Params
		setParams(this, params, {
			hostUrl: { type: 'string', default: '/ws' },
			webResourcePath: { type: 'string', default: '/api/' },
			origin: { type: 'string', default: 'http://localhost' },
			debug: { type: 'bool', default: false },
		});

		this._client = new ResClient(() => new WebSocket(this.hostUrl, {
			origin: this.origin,
		}), {
			namespace,
			eventBus: app.eventBus,
			debug: this.debug
		});

	}

	get client() {
		return this._client;
	}

	/**
	 * Connects the instance to the server.
	 * Can be called even if a connection is already established.
	 * @returns {Promise} A promise to the established connection.
	 */
	connect() {
		return this._client.connect();
	}

	/**
	 * Disconnects any current connection and stops attempts
	 * of reconnecting.
	 */
	disconnect() {
		this._client.disconnect();
	}

	/**
	 * Get a resource from the API
	 * @param {string} rid Resource ID
	 * @param {function} [collectionFactory] Collection factory function.
	 * @return {Promise.<(ResModel|ResCollection)>} Promise of the resource.
	 */
	get(rid) {
		return this._client.get(rid);
	}

	/**
	 * Calls a method on a resource.
	 * @param {string} rid Resource ID.
	 * @param {string} method Method name
	 * @param {*} params Method parameters
	 * @returns {Promise.<object>} Promise of the call result.
	 */
	call(rid, method, params) {
		return this._client.call(rid, method, params);
	}

	/**
	 * Invokes a authentication method on a resource.
	 * @param {string} rid Resource ID.
	 * @param {string} method Method name
	 * @param {*} params Method parameters
	 * @returns {Promise.<object>} Promise of the authentication result.
	 */
	authenticate(rid, method, params) {
		return this._client.authenticate(rid, method, params);
	}

	/**
	 * Sets the onConnect callback.
	 * @param {?ResClient~onConnectCallback} onConnect On connect callback called prior resolving the connect promise and subscribing to stale resources. May return a promise.
	 * @returns {this}
	 */
	setOnConnect(onConnect) {
		return this._client.setOnConnect(onConnect);
	}

	getWebResourceUri(rid) {
		let idx = rid.indexOf('?');
		let rname = idx >= 0 ? rid.substr(0, idx) : rid;
		let query = idx >= 0 ? rid.substr(idx) : '';

		return this.webResourcePath + rname.replace(/\./g, '/') + query;
	}

	isError(resource) {
		return isResError(resource);
	}

	onEvent(rid, cb) {
		this.app.eventBus.on(null, cb, namespace + '.resource' + (rid ? '.' + rid : ''));
	}

	offEvent(rid, cb) {
		this.app.eventBus.off(null, cb, namespace + '.resource' + (rid ? '.' + rid : ''));
	}

	dispose() {
		this.disconnect();
	}
}

export default Api;
