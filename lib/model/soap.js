"use strict";

var soap = require('soap');

/**
 *
 * @param params {url, method}
 * @param cb
 */
function request(params, cb) {
	soap.createClient(params.url, function (err, client) {
		if (err)
			return cb(err);
		else if(!client){
			return cb(new Error("Error Connecting to Auth Server!"));
		}
		else {
			client.login(params.auth, function (loginError, loginResponse) {
				if (loginError) {
					return cb(loginError);
				} else {
					if (loginResponse.access) {
						client.getLayoutsReq(params.body, cb);
					} else {
						return cb(new Error("Invalid credentials"));
					}
				}
			});
		}
	});
}

module.exports = {
	request
};