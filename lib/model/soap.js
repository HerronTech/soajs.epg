"use strict";

var soap = require('soap');

/**
 *
 * @param params {url, method}
 * @param cb
 */
function request(soajs, params, cb) {
	soap.createClient(params.url, {
		wsdl_options: {
			'auth': {
				"user": params.auth.username,
				"pass": params.auth.password,
				'sendImmediately': false
			}
		}
	}, function (err, client) {
		if (err){
			soajs.log.error(err);
			return cb(err);
		}
		else if(!client){
			return cb(new Error("Error Connecting to Auth Server!"));
		}
		else {
			client.login(params.auth, function (loginError, loginResponse) {
				if (loginError) {
					soajs.log.error(loginError);
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