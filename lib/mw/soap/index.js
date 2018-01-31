"use strict";

var states = {
	"find": function (req, res, next) {
		var body = req.soajs.inputmaskData;
		
		let soapAuth;
		let soapUrl;
		
		if (process.env.SOAJS_EP_USERNAME && process.env.SOAJS_EP_PASSWORD && process.env.SOAJS_EP_WSDL) {
			soapAuth = {
				"username": process.env.SOAJS_EP_USERNAME,
				"password": process.env.SOAJS_EP_PASSWORD
			};
			soapUrl = process.env.SOAJS_EP_WSDL;
		}
		else if (req.soajs.servicesConfig && req.soajs.servicesConfig.endPointConfig) {
			let soapHost = req.soajs.servicesConfig.endPointConfig.host;
			
			soapAuth = req.soajs.servicesConfig.endPointConfig.auth;
			soapUrl = soapHost.protocol + "://" + soapHost.domain + ":" + soapHost.port + "/" + soapHost.version + "?wsdl";
		}
		else if (req.soajs.registry.custom && req.soajs.registry.custom.endPointConfig) {
			let soapHost = req.soajs.registry.custom.endPointConfig.host;
			
			soapAuth = req.soajs.registry.custom.endPointConfig.auth;
			soapUrl = soapHost.protocol + "://" + soapHost.domain + ":" + soapHost.port + "/" + soapHost.version + "?wsdl";
		}
		
		if (!soapAuth && !soapUrl) {
			let error = {
				code: 406,
				message: "Invalid end point configuration!"
			};
			return res.soajs.returnAPIResponse(req, res, {code: error.code, error: error, data: null});
		}
		
		let params = {
			url: soapUrl,
			operation: req.url,
			body,
			auth: soapAuth
		};
		
		req.soajs.log.debug(params);
		req.soajs.model.request(req.soajs, params, function (error, response) {
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