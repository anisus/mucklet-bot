import { App } from 'modapp';
import loadConfig from './utils/loadConfig.js';
import loadModules from './utils/loadModules.js';
import parseArgs from './utils/parseArgs.js';

let moduleConfig = {};

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

function botUnsubscribed(ev, bot) {
	console.log("Bot no longer logged in.");
	bot.off('unsubscribe', botUnsubscribed);
	process.exit(0);
}

// Start bot instance
try {
	// Create the app. This will result in all the modules being created and
	// initialized. The app in itself has no entry point, so it is up to the
	// modules to do whatever needs to be done.
	let app = new App(moduleConfig);
	let result = await app.loadBundle(modules);
	// Show results of loading the module bundle
	console.log("Loaded modules: ", Object.keys(result.modules));
	if (result.errors) {
		console.error("Disabled modules: ", result.errors);
	}

	// Get bot module and try to login, to bootstrap it all.
	let botModule = result.modules.bot;
	let bot = await botModule.login();

	console.log("Logged in with " + (bot.char?.name || "bot"));

	// Exit once we are no longer logged in.
	bot.on('unsubscribe', botUnsubscribed);
} catch (e) {
	console.error("Starting bot failed:", e);
}
