"use strict";

var states = {
	"find": function (req, res, next) {
		var body = req.soajs.inputmaskData;
		
		let epConfThrough; // envVar, registry
		let grantaAuth;
		let grantaUrl;
		
		if (process.env.SOAJS_EP_USERNAME && process.env.SOAJS_EP_PASSWORD && process.env.SOAJS_EP_WSDL) {
			grantaAuth = {
				"username": process.env.SOAJS_EP_USERNAME,
				"password": process.env.SOAJS_EP_PASSWORD
			};
			grantaUrl = process.env.SOAJS_EP_WSDL;
		}
		else if (req.soajs.servicesConfig && req.soajs.servicesConfig.endPointConfig) {
			let grantaHost = req.soajs.servicesConfig.endPointConfig.host;
			
			grantaAuth = req.soajs.servicesConfig.endPointConfig.auth;
			grantaUrl = grantaHost.protocol + "://" + grantaHost.domain + ":" + grantaHost.port + "/" + grantaHost.version + "?wsdl";
		}
		else if (req.soajs.registry.custom && req.soajs.registry.custom.endPointConfig) {
			let grantaHost = req.soajs.registry.custom.endPointConfig.host;
			
			grantaAuth = req.soajs.registry.custom.endPointConfig.auth;
			grantaUrl = grantaHost.protocol + "://" + grantaHost.domain + ":" + grantaHost.port + "/" + grantaHost.version + "?wsdl";
		}
		
		if (!grantaAuth && !grantaUrl) {
			let error = {
				code: 406,
				message: "Invalid end point configuration!"
			};
			return res.soajs.returnAPIResponse(req, res, {code: error.code, error: error, data: null});
		}
		
		let params = {
			url: grantaUrl,
			operation: req.url,
			body,
			auth: grantaAuth
		};
		
		req.soajs.model.request(params, function (error, response) {
			if (error) {
				var error = {
					code: 405,
					message: error.toString()
				};
				return res.soajs.returnAPIResponse(req, res, {code: error.code, error: error, data: null});
			} else {
				return res.soajs.returnAPIResponse(req, res, {code: null, error: null, data: response});
			}
		});
	}
};

module.exports = states;