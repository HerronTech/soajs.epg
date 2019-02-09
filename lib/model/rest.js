"use strict";

var requestLib = require('request');

/**
 *
 * @param soajs {Object}
 * @param restParams {url, method}
 * @param cb {Function}
 */
function request(req, res, restParams, cb) {
	let soajs = req.soajs;

	// todo: maybe its better to do it from model
	if(restParams.method === "get"){
		delete restParams.body;
	}
	
	if (restParams.body && Object.keys(restParams.body).length === 0) {
		delete restParams.body;
	}
    let requestJSON = (restParams.body || restParams.json);

	let requestOptions = {
        method : restParams.method,
		uri: restParams.url,
		headers: {
		//	'Content-Type': 'application/json'
		},
		//json: restParams.body || true
	};
	if (requestJSON)
        requestOptions.json = true;
	if (requestOptions.uri){
        let index = requestOptions.uri.indexOf("?");
        if (index !== -1) {
            requestOptions.uri = requestOptions.uri.substr(0, index);
        }
	}

	if (restParams.headers) {
		for (let h in restParams.headers) {
			if (restParams.headers.hasOwnProperty(h)) {
				if (!(h === "key") && !(h === "soajsinjectobj"))
					requestOptions.headers[h] = restParams.headers[h];
			}
		}
	}
	
	if (restParams.authorization) {
		requestOptions.headers.authorization = restParams.authorization;
	}
	
	if (restParams.qs) {
		requestOptions.qs = restParams.qs;
	}
	
	if (restParams.form && Object.keys(restParams.form).length > 0) {
		requestOptions.form = restParams.form;
	}
	
	if (restParams.body && Object.keys(restParams.body).length > 0) {
		requestOptions.body = restParams.body;
	}
	
	// todo: check why headers.host is coming, and why is it making a conflict => <head><title>404 Not Found</title></head>
	if(requestOptions.headers && requestOptions.headers.host){
		delete requestOptions.headers.host;
	}


    soajs.log.debug(requestOptions);

    let redirectedRequest = requestLib(requestOptions);
    redirectedRequest.on('error', function (err) {
        soajs.log.error(err);
        return cb (err);
    });

    if (requestOptions.method === 'POST' || requestOptions.method === 'PUT') {
        req.pipe(redirectedRequest).pipe(res);
    } else {
        redirectedRequest.pipe(res);
    }

	//requestLib[restParams.method](requestOptions, cb);
}

module.exports = {
	request
};