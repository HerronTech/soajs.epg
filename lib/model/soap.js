"use strict";

var soap = require('soap');

/**
 *
 * @param params {url, method}
 * @param cb
 */
function request(soajs, params, cb) {
	
	let options = {};
	if(params.auth && params.auth.username && params.auth.password){
		var auth = "Basic " + new Buffer(params.auth.username + ":" + params.auth.password).toString("base64");
		options = {
			wsdl_headers: {
				"Authorization": auth
			}
		};
	}
	
	soap.createClient(params.url, options, function (err, client) {
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
						client[params.operation](params.body, cb);
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