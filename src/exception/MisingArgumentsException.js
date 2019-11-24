module.exports = class MisingArgumentsException {
    constructor(message) {
        this._name = "MisingArgumentException";
        this._message = message ? message : "Incorrect argument set for this function";
    }
}