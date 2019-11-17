const CommandModule = require('../../../util/Command');

module.exports = timeKeeperCommand = new CommandModule.Command('Time Keeper', 'time');

timeKeeperCommand.description = "Keep track of your time !";