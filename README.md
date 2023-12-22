# Mucklet Bot

## Introduction

Mucklet is the game engine running Wolfery.com. This Node.js project provides a
modular bot for accessing a mucklet API.

## Prerequisites

* Install [Node.js](https://nodejs.org/) v14 or greater

## Quick start

Run the following commands. Replace `<BOT_TOKEN>` with a bot token generated
under _Character Settings_ in the client:

 ```text
git clone https://github.com/anisus/mucklet-bot.git
cd mucklet-bot
npm install
node index.js --bot.token=<BOT_TOKEN> cfg/config.mucklet.js
```

Login at [Mucklet.com](https://mucklet.com) to see the bot in action.

## Usage
```
node index.js [module options] [config file]
```

### Module options

Module options/params can be set by command. Each module option follow the pattern:
```
--<moduleName>.<optionName>=<value>
```

Example:
```
--personality.typeSpeed=500
```

To disable a module, set option `active` to `false`:
```
--<moduleName>.active=false
```

For details on the options of each module, see: [Modules documentation](docs/modules.md)

### Config file

The config file contains configuration for the modules, and may either be a .js or .json file.

See [cfg/config.mucklet.js](cfg/config.mucklet.js) as a reference.

---

## Code structure

### index.js

The entry point is `index.js`. It parses command flags, loads config, and loads the modules.  
> No bot logic should be put in this file.

### utils/
The `utils/` folder contains common helper functions used by modules and `index.js`.

### modules/

This is where the bot logic is found. See the [Modules section](#modules) below for more info.

## Modules

To learn about a specific module, see: [Modules documentation](docs/modules.md)

Quick notes about modules:
* The bot uses [modapp](https://github.com/jirenius/modapp) modules
* A _module_ is a javascript class implementing modapp's [AppModule interface](https://github.com/jirenius/modapp#appmodule-interface)
* A single instance is created of each module on start
* Each module has a unique name (camelCase). Eg. `actionSay`
* Each module has its own folder, and a .js file with its PascalCased name. Eg.:
  ```text
  modules/charPing/CharPing.js
  ```
* Nested folder structure within `modules/` has no meaning except to help group similar modules


### Example module
To create a new module, you can just copy and rename another module. Or create a new file. E.g.:

`modules/myTest/MyTest.js`
```javascript
class MyTest {
	constructor(app, params) {
		// The modapp App instance
		this.app = app;
		// Other modules required
		this.app.require([ 'api' ], this._init);
	}

	// _init is called by app.require with { api: [api module] }
	_init = (module) => {
		// Get the API version from the server and log it to console
		module.api.get('core.info')
			.then(result => console.log("Version: ", result.version));
	}

	dispose() {} // Nothing to dispose
}

export default MyTest;
```

> **Note**
>
> The module files will automatically be found and loaded by `index.js` (if properly named).

## Contribution

Feel free to contribute with feedback or pull requests.
