"use strict";

var requestLib = require('request');

/**
 *
 * @param params {url, method}
 * @param cb
 */
function request(restParams, cb) {
	
	// todo: maybe its better to do it from model
	if(restParams.method === "get"){
		delete restParams.body;
	}
	
	if (restParams.body && Object.keys(restParams.body).length === 0) {
		delete restParams.body;
	}
	
	var requestOptions = {
		uri: restParams.url,
		headers: {
			'Content-Type': 'application/json'
		},
		json: restParams.body || true
	};
	
	if (restParams.headers) {
		for (var h in restParams.headers) {
			if (restParams.headers.hasOwnProperty(h)) {
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
	if (restParams.form !== undefined) {
		requestOptions.form = restParams.form;
	}
	
	if (restParams.body !== undefined) {
		requestOptions.body = restParams.body;
	}
	
	// todo: check why headers.host is coming, and why is it making a conflict => <head><title>404 Not Found</title></head>
	if(requestOptions.headers && requestOptions.headers.host){
		delete requestOptions.headers.host;
	}
	
	requestLib[restParams.method](requestOptions, function (err, response, body) {
		return cb(err, response, body);
	});
}

module.exports = {
	request
};