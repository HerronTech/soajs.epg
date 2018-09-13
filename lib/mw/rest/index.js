"use strict";

let authUtils = require("./../../utils/authorization");
let utils = require("./../../utils/utils");

let chachedAuthParams = {}; // per authMethod
let cachingTime = {}; // per authMethod

var states = {
	"authorize": function (req, res, next) {
		let authorization = utils.getMySchema(req)._authorization; // this route auth method
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

	"request": function (req, res) {
		let allInputs = req.soajs.inputmaskData; // inputs with values
		let qs = {}, body = {}, headers = {};

		let schema = utils.getMySchema(req);
		let schemaKeys = Object.keys(schema);
		let schemaVariablesToSkip = ["_apiInfo", "_authorization"];
		schemaKeys.forEach(function (attribute) {
			if (schemaVariablesToSkip.indexOf(attribute) === -1) {
				let currentSources = schema[attribute].source;

				if (currentSources) {
					currentSources.forEach(function (source) {
						if (allInputs[attribute]) {
							if (source.indexOf("query.") !== -1 || source.indexOf("params.") !== -1) {
								qs[attribute] = allInputs[attribute];
							}
							if (source.indexOf("body.") !== -1) {
								body[attribute] = allInputs[attribute];
							}
							if (source.indexOf("headers.") !== -1) {
								headers[attribute] = allInputs[attribute];
							}
						}
					});
				}
			}// else skip
		});

		let restUrl;
		let epServiceName = req.soajs.config.serviceName;
		if (req.soajs.servicesConfig && req.soajs.servicesConfig[epServiceName]) {
			let restHost = req.soajs.servicesConfig[epServiceName].host;
			restUrl = restHost.protocol + "://" + restHost.domain + ":" + restHost.port;
		}
		else if (req.soajs.registry.custom && req.soajs.registry.custom[epServiceName] && req.soajs.registry.custom[epServiceName].value) {
			let restHost = req.soajs.registry.custom[epServiceName].value.host;
			if(restHost && restHost.protocol && restHost.domain && restHost.port) {
				restUrl = restHost.protocol + "://" + restHost.domain + ":" + restHost.port;
			}
		}

		if (!restUrl) {
			let error = {code: 406, message: "Invalid base url!"};
			return res.soajs.returnAPIResponse(req, res, {code: error.code, error: error, data: null});
		}

		let urlToCall = restUrl + (req.url.charAt(0) === '/') "" : "/";
		urlToCall += req.url;

		let requestParams = {
			url: urlToCall,
			method: req.originalMethod.toLowerCase(),
			body,
			qs,
			headers
		};

		let mergedParams;
		mergedParams = req.soajs.authAddOnsParams ? utils.merge2Params(req, req.soajs.authAddOnsParams, requestParams) : requestParams;
		mergedParams = utils.merge2Params(req, mergedParams, req); // merge this request with the request sent (so far used for headers)

		req.soajs.log.debug(mergedParams);
		req.soajs.model.request(req.soajs, mergedParams, function (error, response, body) {
			if (error) {
				let errorObject = {code: 405, message: error.toString()};
				return res.soajs.returnAPIResponse(req, res, {code: errorObject.code, error: errorObject, data: null});
			}

			return res.soajs.returnAPIResponse(req, res, {code: null, error: null, data: body});
		});
	}
};

module.exports = states;
