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
			if(client){
				let operation = params.operation;
				operation = operation.substring(1, operation.length); // remove the first slash
				soajs.log.debug(`Calling operation [${operation}]`);
				client[operation](params.body, cb);
			}else{
				return cb(new Error("Invalid Client"));
			}
		}
	});
}

module.exports = {
	request
};