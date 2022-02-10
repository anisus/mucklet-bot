import { App } from 'modapp';
import loadConfig from './utils/loadConfig.js';
import loadModules from './utils/loadModules.js';
import parseArgs from './utils/parseArgs.js';

let moduleConfig = {
	app: {
		instances: 1,          // 1 instance by default
		waitBetween: 1 * 1000, // 1 seconds wait between each new instance
	}
};

try {
	// Parse configuration from arguments
	let { config, path } = parseArgs(process.argv.slice(2));
	// Load configuration from .js, .mjs, or .json file
	let fileConfig = await loadConfig(path);
	// Merge argument and file configuration with priority to command arguments.
	moduleConfig = Object.assign(moduleConfig, fileConfig);
	if (config) {
		for (let k in config) {
			moduleConfig[k] = Object.assign({}, moduleConfig[k], config[k]);
		}
	}
	console.log("Config: ", moduleConfig);
} catch (e) {
	console.error("Loading configuration failed:", e);
	process.exit(1);
}

let modules;
try {
	// Load all modules into a bundle
	modules = await loadModules("./modules");
} catch (e) {
	console.error("Loading modules failed:", e);
	process.exit(1);
}

// User instances
let users = [];
function userUnsubscribed(ev, user) {
	console.log("User " + user.name + " no longer logged in.");
	for (let i = 0; i < users.length; i++) {
		if (users[i] == user) {
			user.off(userUnsubscribed);
			users.splice(i, 1);
			break;
		}
	}
	if (!users.length) {
		process.exit(0);
	}
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Start bot instances
let instances = moduleConfig.app.instances || 1;
let waitBetween = moduleConfig.app.waitBetween || 1000;
let username = (moduleConfig.login && moduleConfig.login.user || 'bot');
console.log("Starting " + instances + " bot" + (instances == 1 ? '' : 's'));
for (let i = 0; i < instances; i++) {
	let modConfig = Object.assign({}, moduleConfig);
	// Add _{i} prefix for usernames. Instance 0 gets no suffix.
	if (i > 0) {
		modConfig.login = Object.assign({}, modConfig.login, { user: username + '_' + i });
	}

	await timeout(i ? waitBetween : 0);

	try {
		// Create the app.
		// This will result in all the modules being created and initialized. The app in
		// itself has no entry point, so it is up to the modules to do whatever needs to
		// be done.
		let app = new App(modConfig);
		let result = await app.loadBundle(modules);
		// Show results of loading the module bundle
		console.log("Loaded modules: ", Object.keys(result.modules));
		if (result.errors) {
			console.error("Disabled modules: ", result.errors);
		}

		// Get login module and try to get user
		let login = result.modules.login;
		let user = await login.getUserPromise();

		console.log("Logged in with #" + (i + 1) + ": " +  (user.name || user.identity.name));
		users.push(user);

		// Exit once we are no longer logged in
		user.on('unsubscribe', userUnsubscribed);
	} catch (e) {
		console.error("Starting bot failed:", e);
		if (!users.length) {
			process.exit(1);
		}
	}
}

