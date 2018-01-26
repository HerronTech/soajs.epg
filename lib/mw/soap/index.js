"use strict";

var states = {
	"find": function (req, res, next) {
		var body = req.soajs.inputmaskData;
		
		let epConfThrough; // envVar, registry
		let grantaAuth;
		let grantaUrl;
		
		if (process.env.SOAJS_EP_USERNAME && process.env.SOAJS_EP_PASSWORD && process.env.SOAJS_EP_WSDL) {
			epConfThrough = "envVar";
		}
		
		if (req.soajs.registry.custom && req.soajs.registry.custom.endPointConfig) {
			epConfThrough = "registry"
		}
		
		if (!epConfThrough) {
			var error = {
				code: 406,
				message: "Invalid end point configuration!"
			};
			return res.soajs.returnAPIResponse(req, res, {code: error.code, error: error, data: null});
		} else {
			if (epConfThrough === "envVar") { // priority for env variables
				grantaAuth = {
					"username": process.env.SOAJS_EP_USERNAME,
					"password": process.env.SOAJS_EP_PASSWORD
				};
				grantaUrl = process.env.SOAJS_EP_WSDL;
			} else if (epConfThrough === "registry") {
				let grantaHost = req.soajs.registry.custom.endPointConfig.host;
				
				grantaAuth = req.soajs.registry.custom.endPointConfig.auth;
				grantaUrl = grantaHost.protocol + "://" + grantaHost.domain + ":" + grantaHost.port + "/" + grantaHost.version + "?wsdl";
			}
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