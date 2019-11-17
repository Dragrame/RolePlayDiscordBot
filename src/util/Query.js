const stringMarks = ['\'', '"', '`'];

/**
 * @class
 */
exports.Query = Query = class Query {
    constructor(rawQuery) {
        this._rawQuery = rawQuery;
        this._parsedQuery = this.parse(this._rawQuery);
        this._typedQuery = this.type(this._parsedQuery);
    }

    /**
     * Parse a command-line like query into an array of items
     * @param {string} rawQuery a raw query as a string
     * @returns {string[]} parsed command
     */
    parse(rawQuery) {
        let res = [];
        let isNextPart = true;
        let quote = null;
        for(let i = 0; i < rawQuery.length; i++) {
            const char = rawQuery.charAt(i);
            switch (char) {
                case '\'':
                case '"':
                case '`': {
                    if ( quote === null ) {
                        quote = char;
                        res.push(char);
                        isNextPart = false;
                        break;
                    }
                    else if ( quote === char ) {
                        quote = null;
                        res[res.length-1] += char;
                        isNextPart = true;
                        break;
                    }
                    else {
                        res[res.length-1] += char;
                        break;
                    }
                }
                case ' ': {
                    if ( !quote ) {
                        isNextPart = true;
                        break;
                    }
                }
                default: {
                    if (isNextPart) {
                        isNextPart = false;
                        res.push(char);
                    } else {
                        res[res.length-1] += char;
                    }
                    break;
                }
            }
        }
        return res;
    }

    /**
     * Type a parsed command-line like query to distinguish elements of the query
     * @param {string[]} parsedQuery
     * @returns {QueryElement[]}
     */
    type(parsedQuery) {
        let res = [];
        parsedQuery.forEach( rawElement => {
            res.push(new QueryElement(rawElement) );
        })
        return res;
    }

    /**
     * @returns {string[]}
     */
    get parsedQuery() {
        return this._parsedQuery;
    }

    /**
     * @returns {QueryElement[]}
     */
    get typedQuery() {
        return this._typedQuery;
    }
}

/**
 * @class
 */
exports.QueryElement = QueryElement = class QueryElement {
    
    /**
     * @param {string} rawElement 
     */
    constructor(rawElement) {
        this._rawElement = rawElement;
        this._type = null;
        this._body = null;

        if (rawElement.length === 0) { 
            this._type = null; 
        }
        else if (rawElement.startsWith('--')) {
            this._type = Types.OPTION;
            this._body = rawElement.slice(2, rawElement.length);
        }
        else if (rawElement.startsWith('-')) {
            this._type = Types.OPTION;
            this._body = rawElement.slice(1, rawElement.length);
        }
        else if (stringMarks.includes(rawElement.charAt(0)) 
                 && rawElement.charAt(0) === rawElement.charAt(rawElement.length-1) 
        ){
            this._type = Types.STRING;
            this._body = rawElement.slice(1, rawElement.length-1);
        }
        else {
            this._type = Types.COMMAND;
            this._body = rawElement;
        }
    }

    get type() {
        return this._type;
    }

    get body() {
        return this._body;
    }

    get raw() {
        return this._rawElement;
    }
}

/**
 * @enum
 */
exports.QueryType = Types = {
    COMMAND: 'command',
    OPTION: 'option',
    STRING: 'string'
}