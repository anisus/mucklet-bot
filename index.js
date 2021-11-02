import { App } from 'modapp';
import loadConfig from './utils/loadConfig.js';
import loadModules from './utils/loadModules.js';
import parseArgs from './utils/parseArgs.js';

try {
	// Parse configuration from arguments
	let { config, path } = parseArgs(process.argv.slice(2));
	// Load configuration from .js, .mjs, or .json file
	let fileConfig = await loadConfig(path);
	// Merge argument and file configuration with priority to command arguments.
	let moduleConfig = Object.assign({}, fileConfig);
	if (config) {
		for (let k in config) {
			moduleConfig[k] = Object.assign({}, moduleConfig[k], config[k]);
		}
	}
	console.log("Config: ", moduleConfig);

	// Load all modules into a bundle
	let modules = await loadModules("./modules");

	// Create the app.
	// This will result in all the modules being created and initialized. The app in
	// itself has no entry point, so it is up to the modules to do whatever needs to
	// be done.
	let app = new App(moduleConfig);
	let result = await app.loadBundle(modules);
	// Show results of loading the module bundle
	console.log("Loaded modules: ", Object.keys(result.modules));
	if (result.errors) {
		console.error("Disabled modules: ", result.errors);
	}

	// Get login module and try to get user
	const login = result.modules.login;
	let user = await login.getUserPromise();

	console.log("Logged in with " + user.name);

	// Exit once we are no longer logged in
	user.on('unsubscribe', () => {
		console.log("No longer logged in. Exiting.");
		process.exit(0);
	});
} catch (e) {
	console.error("Starting bot failed:", e);
	process.exit(1);
}
