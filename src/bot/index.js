const CommandModule = require('../util/Command');
const Config = require('../../package.json');

module.exports = bot = new CommandModule.Command('RP Bot', Config.prefix);

bot.description = 'A basic bot to do some role plays !';

bot.action = function(msg) {
    bot.fetchHelp(msg);
}

// Add all command modules to the main bot command
bot.addChildCommand(require('./modules/dice-roller'));
bot.addChildCommand(require('./modules/time-keeper'));
bot.addChildCommand(require('./modules/vote'));