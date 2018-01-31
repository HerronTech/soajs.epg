"use strict";

let authUtils = require("./../../utils/authorization");

let chachedAuthParams = {}; // per authMethod
let cachingTime = {}; // per authMethod

function merge2Objects(obj1, obj2) {
	let output = {};
	
	if (!obj1 || !obj2) {
		if (!obj1 && !obj2) {
			return {};
		}
		if (!obj1) {
			return obj2;
		}
		if (!obj2) {
			return obj1;
		}
	} else {
		if (typeof obj1 != 'object' || typeof obj2 != 'object') {
			console.log("Unexpected types!");
			return {};
		} else {
			let obj1Keys = Object.keys(obj1);
			let obj2Keys = Object.keys(obj2);
			
			obj1Keys.forEach(function (obj1Each) {
				output[obj1Each] = obj1[obj1Each];
			});
			
			obj2Keys.forEach(function (obj2Each) {
				output[obj2Each] = obj2[obj2Each];
			});
			
			return output;
		}
	}
}

function merge2Params(param1, param2) {
	let output = {
		url: param1.url || param2.url,
		body: merge2Objects(param1.body, param2.body),
		qs: merge2Objects(param1.qs, param2.qs),
		headers: merge2Objects(param1.headers, param2.headers),
		method: param1.method || param2.method
	};
	return output;
}

function getMySchema(req) {
	let schema = req.url;
	let interrogationIndex;
	if ((interrogationIndex = schema.indexOf("?")) !== -1) {
		schema = schema.substring(0, interrogationIndex);
	}
	
	return req.soajs.config.schema[req.originalMethod.toLowerCase()][schema];
}

var states = {
	"authorize": function (req, res, next) {
		let authorization = getMySchema(req)._authorization; // this route auth method
		let authorizationResource = req.soajs.registry.resources.authorization[authorization];
		
		if (authorization) {
			let currentTime = Date.now() / 1000; // in seconds
			if (authorizationResource.cachingEnabled && chachedAuthParams[authorization] && currentTime < (cachingTime[authorization] + authorizationResource.ttl)) {
				req.soajs.authAddOnsParams = chachedAuthParams[authorization];
				next();
			} else {
				authUtils.authorize(req, res, authorizationResource, authorization, function (authParams) {
					req.soajs.authAddOnsParams = authParams;
					
					cachingTime[authorization] = Date.now() / 1000; // in seconds
					chachedAuthParams[authorization] = authParams;
					
					next();
				});
			}
		} else {
			next();
		}
	},
	
	"find": function (req, res, next) {
		let allInputs = req.soajs.inputmaskData; // inputs with values
		let qs = {}, body = {}, headers = {};
		
		let schema = getMySchema(req);
		let schemaKeys = Object.keys(schema);
		let schemaVariablesToSkip = ["_apiInfo", "_authorization"];
		schemaKeys.forEach(function (attribute) {
			if (schemaVariablesToSkip.indexOf(attribute) === -1) {
				let currentSources = schema[attribute].source;
				
				currentSources.forEach(function (source) {
					if (source.indexOf("query.") !== -1 || source.indexOf("params.") !== -1) {
						qs[attribute] = allInputs[attribute];
					}
					if (source.indexOf("body.") !== -1) {
						body[attribute] = allInputs[attribute];
					}
					if (source.indexOf("headers.") !== -1) {
						headers[attribute] = allInputs[attribute];
					}
				});
			}// else skip
		});
		
		let restUrl;
		if (process.env.SOAJS_EP_BASE_URL) {
			restUrl = process.env.SOAJS_EP_BASE_URL;
		}
		else if (req.soajs.servicesConfig && req.soajs.servicesConfig.endPointConfig) {
			let restHost = req.soajs.servicesConfig.endPointConfig.host;
			restUrl = restHost.protocol + "://" + restHost.domain + ":" + restHost.port + "/";
		}
		else if (req.soajs.registry.custom && req.soajs.registry.custom.endPointConfig) {
			let restHost = req.soajs.registry.custom.endPointConfig.host;
			restUrl = restHost.protocol + "://" + restHost.domain + ":" + restHost.port + "/";
		}
		
		if (!restUrl) {
			let error = {
				code: 406,
				message: "Invalid base url!"
			};
			return res.soajs.returnAPIResponse(req, res, {code: error.code, error: error, data: null});
		}
		
		let urlToCall = restUrl + req.url;
		
		console.log("Will call [" + urlToCall + "]");
		let requestParams = {
			url: urlToCall,
			method: req.originalMethod.toLowerCase(),
			body,
			qs,
			headers
		};
		
		let mergedParams;
		if (req.soajs.authAddOnsParams) {
			mergedParams = merge2Params(req.soajs.authAddOnsParams, requestParams);
		} else {
			mergedParams = requestParams;
		}
		
		mergedParams = merge2Params(mergedParams, req); // merge this request with the request sent (so far used for headers)
		
		req.soajs.model.request(req.soajs, mergedParams, function (error, response, body) {
			if (error) {
				var error = {
					code: 405,
					message: error.toString()
				};
				return res.soajs.returnAPIResponse(req, res, {code: error.code, error: error, data: null});
			} else {
				return res.soajs.returnAPIResponse(req, res, {code: null, error: null, data: body});
			}
		});
		
	}
};

module.exports = states;