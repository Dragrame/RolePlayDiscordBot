const CommandModule = require('../../../util/Command');
const InvalidArgumentException = require('../../../exception/InvalidArgumentException');

module.exports = diceRollerCommand = new CommandModule.Command('Dice Roller', 'dice');

diceRollerCommand.description = "Roll the dices to know your fate !";

/**
 * Roll dices coresponding to given arguments
 * @param {Discord.Message} msg message received from Discord
 * @param {QueryModule.QueryElement[]} queryArguments parsed query elements used as arguments
 * @throws {InvalidArgumentException} for an uncorrect argument
 */
diceRollerCommand.action = function (msg, queryArguments) {
    try {
        parsedArgs = queryArguments.map(argument => parseArgument(argument.body));
        rollResult = rollDices(parsedArgs);
        fetch(msg, parsedArgs, rollResult);
    } catch (e) {
        throw e;
    }
}

/**
 * Parse a given argement
 * @param {string} arg 
 * @return {string[]} parsed dice argument
 * @throws {InvalidArgumentException} for an uncorrect argument
 */
function parseArgument(arg) {
    const exceptionMsg = 'Not parsable argument: Given argument expected like "<numberOfDices>d<maxValue>" but received "' + arg + '".';
    const parsedArg = arg.split('d');
    if ( parsedArg.length !== 2 ) {
        throw new InvalidArgumentException(exceptionMsg);
    }
    intArg = parsedArg.map(value => {
        let intValue = parseInt(value, 10);
        if (isNaN(intValue)) {
            throw new InvalidArgumentException(exceptionMsg);
        }
        return intValue;
    });
    return intArg;
}

/**
 * Return a number between 1 and a max value (included)
 * @param {int} max
 * @returns {int} random result
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
}

/**
 * @param {string[][]} args array of rolls <numberOfDices> <maxValue>
 * @returns {string[][]} results of rolls
 */
function rollDices(args) {
    const res = [];
    args.forEach( roll => {
        const rollRes = [];
        for(let i = 0; i < roll[0]; i++) {
            rollRes.push(getRandomInt(roll[1]));
        }
        res.push(rollRes);
    });
    return res;
}

/**
 * Send an answer to tell to the Client what are the results
 * @param {Discord.Message} msg message received from Discord
 * @param {string[][]} rolls rolls performed
 * @param {string[][]} results result of rolls 
 */
function fetch(msg, rolls, results) {
    let reply = "";
    let nbRolls = Math.min(rolls.length, results.length);
    for (let i = 0; i < nbRolls; i++) {
        reply += `${rolls[i][0]}d${rolls[i][1]}: ` + 
                 `${results[i]} ` +
                 `(${results[i].reduce((pv, cv) => pv + cv, 0)})\n`;
    }
    reply += `Total: ${results.reduce((pv, cv) => pv + cv.reduce((p, c) => p + c, 0), 0)}`
    msg.channel.send(reply);
}

diceRollerCommand.wiki = function(parentQuery) {
    return `${"`"}${parentQuery} <numberOfRolls>d<numberOfDiceFaces>${"`"}`;
}