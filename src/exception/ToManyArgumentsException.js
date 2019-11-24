module.exports = class ToManyArgumentsException {
    constructor(message) {
        this._name = "ToManyArgumentException";
        this._message = message ? message : "Incorrect argument set for this function";
    }
}