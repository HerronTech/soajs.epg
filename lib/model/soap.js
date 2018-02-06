"use strict";

var nodejsrequest = require("request");
var soap = require('soap');
var xml2json = require("xml2json");

function constructXML (jsonObj, operation, soapAction) {
	function loopRecusively(srcObj) {
		if (Array.isArray(srcObj)) {
			let outObj = [];
			srcObj.forEach((oneArrayEntry) => {
				outObj.push(loopRecusively(oneArrayEntry));
			});
			return outObj;
		}
		else if (typeof srcObj === 'object') {
			let outObj = {};
			for (let l1 in srcObj) {
				outObj[l1] = loopRecusively(srcObj[l1]);
			}
			return outObj;
		}
		else {
			// console.log({"$t": srcObj})
			return {"$t": srcObj};
		}
	}
	
	let obj = loopRecusively(jsonObj);
	
	let body = {};
	
	if(Object.keys(jsonObj).length > 0){
		body[operation] = obj;
		body[operation]["xmlns"] = soapAction;
	}
	
	return xml2json.toXml(body);
}

/**
 *
 * @param params {url, method}
 * @param cb
 */
function request(soajs, params, cb) {
	let options = {};
	if (params.auth && params.auth.username && params.auth.password) {
		var auth = "Basic " + new Buffer(params.auth.username + ":" + params.auth.password).toString("base64");
		options = {
			wsdl_headers: {
				"Authorization": auth
			}
		};
	}
	
	let url = params.api + params.wsdl + "?wsdl";
	soap.createClient(url, options, function (err, client) {
		if (err) {
			soajs.log.error(err);
			return cb(err);
		}
		else if (!client) {
			return cb(new Error("Error Connecting to Auth Server!"));
		}
		else {
			if (client) {
				let operation = params.operation;
				operation = operation.substring(1, operation.length); // remove the first slash
				if(Object.hasOwnProperty.call(client, operation) ){
					soajs.log.debug(`Calling operation [${operation}]`);
					
					var xmlBody = constructXML(params.body, operation, params.SOAPAction);
					
					var xmlCode = params.SOAPEnvelope;
					xmlCode = xmlCode.replace("__API__", params.api);
					xmlCode = xmlCode.replace("__xmlBody__", xmlBody);
					
					var deliveryOptions = {
						url: params.api + params.wsdl,
						json: false,
						method: params.method,
						auth: params.auth,
						headers: params.headers,
						body: xmlCode
					};
					
					deliveryOptions.headers['SOAPAction'] = params.SOAPAction + params.operation + "Request";
					
					soajs.log.debug(deliveryOptions);
					nodejsrequest[params.method.toLowerCase()](deliveryOptions, function (error, response, body) {
						if (error) {
							return cb(error);
						}
						
						body = body.trim();
						body = xml2json.toJson(body, {
							object: true,
							reversible: false,
							coerce: false,
							sanitize: true,
							trim: true
						});
						
						return cb(null, body);
					});
				}
				else{
					return cb(new Error(`Operation ${operation} not found`));
				}
			} else {
				return cb(new Error("Invalid Client"));
			}
		}
	});
}

module.exports = {
	request
};