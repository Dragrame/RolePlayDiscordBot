const QueryModule = require('./Query');

/**
 * @class
 */
exports.Command = Command = class Command {
    constructor(name) {
        this._name = name;
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
     * Find a matching command with a given query
     * @param {QueryModule.QueryElement[]} query
     * @returns {Command}
     */
    findMatch(typedQuery) {
        // End if there's no query
        if (typedQuery.length === 0) return null;
        const headElement = typedQuery.shift();

        // React if the first element is a command matching with this command's name
        if (
            headElement.type === QueryModule.QueryType.COMMAND
            && headElement.body === this._name
        ) {
            // Check for a match in child commands
            let childMatch = null;
            for (const childCommand of this._childCommands) {
                childMatch = childCommand.findMatch(typedQuery);
                // If there is a match, return it
                if (childMatch) return childMatch;
            }
            // Else, return this command
            return this;
        }
        // End if there's no match
        else return null;
    }

}