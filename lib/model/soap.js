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
			cb(err);
		else {
			client.login(params.auth, function (loginError, loginResponse) {
				if (loginError) {
					cb(loginError);
				} else {
					if (loginResponse.access) {
						client.getLayoutsReq(params.body, function (err, response) {
							if (err)
								cb(err);
							else {
								cb(null, response);
							}
						});
					} else {
						cb("Invalid Granta credentials");
					}
				}
			});
		}
	});
}

module.exports = {
	request
};