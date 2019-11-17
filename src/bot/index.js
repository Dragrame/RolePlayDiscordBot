const CommandModule = require('../util/Command');
const Config = require('../../config/config.json');

module.exports = bot = new CommandModule.Command(Config.prefix);

// Add all command modules to the main bot command
bot.addChildCommand(require('./modules/dice'));
bot.addChildCommand(require('./modules/help'));
bot.addChildCommand(require('./modules/time'));