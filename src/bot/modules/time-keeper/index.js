const CommandModule = require('../../../util/Command');
const ToManyArgumentsException = require('../../../exception/ToManyArgumentsException');
const MisingArgumentsException = require('../../../exception/MisingArgumentsException');
const InvalidArgumentException = require('../../../exception/InvalidArgumentException');

module.exports = timeKeeperCommand = new CommandModule.Command('Time Keeper', 'time');

const remainders = [600, 300, 60, 30, 10, 5, 4, 3, 2, 1, 0];

timeKeeperCommand.description = "Keep track of your time !";

/**
 * Decount time, according to given arguments
 * @param {Discord.Message} msg message received from Discord
 * @param {QueryModule.QueryElement[]} queryArguments parsed query elements used as arguments
 * @throws {InvalidArgumentException} for an uncorrect argument
 */
timeKeeperCommand.action = function (msg, queryArguments) {
    try {
        parsedTime = parseArguments(queryArguments);
        countdown(msg, parsedTime);
    } catch (e) {
        throw e;
    }
}

/**
 * Parse a given argement
 * @param {QueryModule.QueryElement[]} queryArguments parsed query elements used as arguments
 * @returns {number} parsed time in seconds
 * @throws {ToManyArgumentsException} for an uncorrect argument
 */
function parseArguments(queryArguments) {
    if (queryArguments.length > 1) {
        throw new ToManyArgumentsException(`Expected 1 argument but received ${queryArguments.length}.`);
    }
    if (queryArguments.length === 0) {
        throw new MisingArgumentsException(`Expected 1 argument but received ${queryArguments.length}.`);
    }
    let res = parseInt(queryArguments[0].body);
    if (isNaN(res)) {
        throw new InvalidArgumentException('Not parsable argument: Given argument expected like "<timeInSeconds>" but received "' + queryArguments[0].body + '".');
    }
    return res;
}

/**
 * Doing the countdown
 * @param {Discrod.Message} msg 
 * @param {number} time 
 */
function countdown(msg, time) {
    const endTime = Date.now() + time * 1000;

    for(let remainder of remainders) {
        let remainingTime = endTime - Date.now();
        if (remainder * 1000 >= remainingTime) continue;
        setTimeout(() => {
            if (remainder >= 60) msg.channel.send(`${remainder / 60} minute${ remainder > 120 ? 's': null } left!`);
            else if (remainder > 5) msg.channel.send(`${remainder} seconds left!`);
            else if (remainder > 0) msg.channel.send(`${remainder}!`);
            else msg.channel.send(`Time's up!`);
        }, remainingTime - remainder * 1000)
    }
}