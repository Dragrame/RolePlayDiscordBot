module.exports = class InvalidArgumentException {
    constructor(message) {
        this._name = "InvalidArgumentException";
        this._message = message ? message : "Incorrect argument set for this function";
    }
}