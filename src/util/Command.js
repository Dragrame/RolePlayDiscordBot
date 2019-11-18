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
        this._wiki = null;
        this._action = function(msg, query){};
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
                this.fetchAction(msg, subQuery, () => this.fetchHelp(msg, parentElements));
                return this;
            }

            // Else, if the next element is an help command, return this help
            if (
                subQuery[0].type === QueryModule.QueryType.COMMAND
                && subQuery[0].body === "help"
            ) {
                this.fetchHelp(msg, parentElements);
                return this;
            }
            
            // Else, check for a match in child commands
            let childMatch = null;
            for (const childCommand of this._childCommands) {
                childMatch = childCommand.findMatch(
                    msg,
                    typedQuery.slice(1, typedQuery.length),
                    parentElements.concat(typedQuery[0])
                );
                // If there is a match, return it
                if (childMatch !== null) return childMatch;
            }

            // Try to execute this action
            return this.fetchAction(msg, subQuery, () => this.fetchHelp(msg, parentElements));
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

        // Construct the help reply with child commands
        let reply = `**${this._name}** : ${this._description}\n`;
        this._childCommands.forEach( command => {
            reply += `${command.name} : `
            reply += `${"`"}${parentQuery} ${command.prefix}${"`"} - ${command.description}\n`
        });

        // Construct the help reply with parameters
        if (this._wiki) reply += this._wiki(parentQuery) + "\n";

        if (reply !== '') msg.channel.send(reply);
    }

    /**
     * Perform the command action. If it fails, display help.
     * @param {string} msg
     * @param {QueryModule.QueryElement[]} subQuery
     * @param {Function} failCallback
     */
    fetchAction(msg, subQuery, failCallback) {
        try {
            this._action(msg, subQuery);
        } catch (e) {
            failCallback();
        }
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
     */
    set action(value) {
        this._action = value;
    }

    /**
     * @returns {string}
     */
    get description() {
        return this._description;
    } 

    /**
     * @param {string}
     */
    set description(value) {
        this._description = value;
    }

    /**
     * @returns {Function}
     */
    get wiki() {
        return this._wiki;
    }

    /**
     * @param {Function}
     */
    set wiki(value) {
        this._wiki = value;
    }
}