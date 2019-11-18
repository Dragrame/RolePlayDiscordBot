const CommandModule = require('../../../util/Command');

module.exports = voteCommand = new CommandModule.Command('Vote', 'vote');

voteCommand.description = "Everyone vote to select their best choice";