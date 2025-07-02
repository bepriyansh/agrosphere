function logger(req, res, next) {
    const start = Date.now();
    console.log(`Request Method: ${req.method}, Request URL: ${req.originalUrl}`);
    next();
}

module.exports = logger;
