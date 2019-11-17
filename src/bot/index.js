const CommandModule = require('../util/Command');
const Config = require('../../config.json');

module.exports = bot = new CommandModule.Command(Config.prefix);

bot.addChildCommand(new CommandModule.Command('help'));