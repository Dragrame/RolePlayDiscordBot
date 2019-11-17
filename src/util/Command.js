const Discord = require('discord.js');
const QueryModule = require('./Query');

/**
 * @class
 */
exports.Command = Command = class Command {
    constructor(name, prefix) {
        this._name = name;
        this._prefix = prefix;
        this._description = null;
        this._action = function(msg){};
        this._childCommands = [];
    }

    /**
     * Add a child to this command
     * @param {Command} command
     */
    addChildCommand(command) {
        this._childCommands.push(command);
    }

    /**
     * Find a matching command with a given query and perform the associated action
     * @param {Discord.Message} msg original discord message used to reply
     * @param {QueryModule.QueryElement[]} typedQuery parsed query to analyse
     * @param {QueryModule.QueryElement[]} parentElements parent command elements used to reach this command
     * @returns {Command} 
     */
    findMatch(msg, typedQuery, parentElements = []) {
        // End if there's no query
        if (typedQuery.length === 0) return null;

        // React if the first element is a command matching with this command's name
        if (
            typedQuery[0].type === QueryModule.QueryType.COMMAND
            && typedQuery[0].body === this._prefix
        ) {
            const subQuery = typedQuery.slice(1, typedQuery.length);
            
            // If the subquery is empty, perform this action
            if (subQuery.length === 0) {
                this._action(msg, typedQuery);
                return this;
            }

            // Else, if the next element is an help command, return this help
            if (
                subQuery[0].type === QueryModule.QueryType.COMMAND
                && subQuery[0].body === "help"
            ) {
                this.fetchHelp(msg);
                return this;
            }
            
            // Else, check for a match in child commands
            let childMatch = null;
            for (const childCommand of this._childCommands) {
                childMatch = childCommand.findMatch(
                    msg,
                    typedQuery.slice(1, typedQuery.length),
                    parentElements.push(typedQuery[0])
                );
                // If there is a match, return it
                if (childMatch !== null) return childMatch;
            }
        }
        // End if there's no match
        else return null;
    }

    /**
     * Reply with the default help message
     * @param {Discord.Message} msg
     * @param {QueryModule.QueryElement[]} parentElements parent command elements used to reach this command
     */
    fetchHelp(msg, parentQueryElements = []) {
        // Get the full parent query
        let parentQuery = '';
        parentQueryElements.forEach( element => {
            if (element.type === QueryModule.QueryType.COMMAND) {
                parentQuery += element.body + ' ';
            }
        });
        parentQuery += this._prefix;

        // Construct the help reply
        let reply = `**${this._name}** : ${this._description}\n`;
        this._childCommands.forEach( command => {
            reply += `${command.name} : `
            reply += `${"`"}${parentQuery} ${command.prefix}${"`"} - ${command.description}\n`
        });

        if (reply !== '') msg.channel.send(reply);
    }

    /**
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * @returns {string}
     */
    get prefix() {
        return this._prefix;
    }

    /**
     * @returns {Function}
     */
    get action() {
        return this._action;
    }

    /**
     * @param {Function}
     * @returns {Command}
     */
    set action(value) {
        this._action = value;
        return this;
    }

    /**
     * @returns {string}
     */
    get description() {
        return this._description;
    } 

    /**
     * @param {string}
     * @returns {Command}
     */
    set description(value) {
        this._description = value;
        return this;
    }

}