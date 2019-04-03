"use strict";

const requestLib = require('request');

/**
 *
 * @param req
 * @param res
 * @param restUrl
 * @param reqJson
 * @param cb
 */
function request(req, res, restUrl, reqJson, cb) {
    let soajs = req.soajs;

    let requestOptions = {
        'method': req.method,
        'uri': restUrl,
        'timeout': 1000 * 3600,
        'headers': req.headers
    };
    if (reqJson)
        requestOptions.json = true;

    soajs.log.debug(requestOptions);

    let redirectedRequest = requestLib(requestOptions);
    redirectedRequest.on('error', function (err) {
        soajs.log.error(err);
        return cb(err);
    });

    if (requestOptions.method === 'POST' || requestOptions.method === 'PUT') {
        req.pipe(redirectedRequest).pipe(res);
    } else {
        redirectedRequest.pipe(res);
    }
}

module.exports = {
    request
};