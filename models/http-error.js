class HttpError extends Error {
    constructor(message, errorCode) {
        super(message);
        code = errorCode;
    }
}

module.exports = HttpError;