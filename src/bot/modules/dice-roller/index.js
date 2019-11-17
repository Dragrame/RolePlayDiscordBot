const CommandModule = require('../../../util/Command');

module.exports = diceRollerCommand = new CommandModule.Command('Dice Roller', 'dice');

diceRollerCommand.description = "Roll the dices to know your fate !";