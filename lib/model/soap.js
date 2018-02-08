"use strict";

var nodejsrequest = require("request");
var xml2json = require("xml2json");
var utils = require("./../utils/utils");

/**
 * construct XML body from a JSON object
 *
 * @param jsonObj
 * @param operation
 * @param soapAction
 * @returns {*}
 */
function constructXML(jsonObj, operation, soapAction) {
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
	
	if (jsonObj && Object.keys(jsonObj).length > 0) {
		body[operation] = obj;
		body[operation]["xmlns"] = soapAction;
	}
	
	return xml2json.toXml(body);
}

/**
 * do soap call
 *
 * @param params {url, method}
 * @param cb
 */
function request(soajs, params, cb) {
	let operation = params.operation;
	operation = operation.substring(1, operation.length); // remove the first slash
	soajs.log.debug(`Calling operation [${operation}]`);
	
	var xmlBody = constructXML(params.body, operation, params.SOAPAction);
	
	var xmlCode = params.SOAPEnvelope;
	xmlCode = xmlCode.replace("__API__", params.api);
	xmlCode = xmlCode.replace("__xmlBody__", xmlBody);
	
	var deliveryOptions = {
		url: utils.cleanUrl(params.api, params.wsdl),
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
		
		try {
			body = body.trim();
			body = xml2json.toJson(body, {
				object: true,
				reversible: false,
				coerce: false,
				sanitize: true,
				trim: true
			});
		} catch (exception) {
			return cb(exception);
		}
		
		return cb(null, body);
	});
}

module.exports = {
	request
};