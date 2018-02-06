"use strict";

let utils = require("./../../utils/utils");

var states = {
	"find": function (req, res, next) {
		var body = req.soajs.inputmaskData;
		
		if (Object.keys(body).length === 0) {
			body = null;
		}
		
		let soapAuth;
		let soapAPI;
		let soapWSDL;
		let SOAPAction;
		
		let SOAPEnvelope = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:api=\"__API__\"><soapenv:Body>__xmlBody__</soapenv:Body></soapenv:Envelope>";
		
		let SOAPHeaders = {
			'Content-Type': 'text/xml;charset=UTF-8',
		};
		
		if (req.soajs.servicesConfig && req.soajs.servicesConfig.endPointConfig) {
			let soapHost = req.soajs.servicesConfig.endPointConfig.host;
			
			soapWSDL = req.soajs.servicesConfig.endPointConfig.wsdl;
			SOAPAction = req.soajs.servicesConfig.endPointConfig.SOAPAction;
			
			if (req.soajs.servicesConfig.endPointConfig.envelope) {
				SOAPEnvelope = req.soajs.servicesConfig.endPointConfig.envelope;
			}
			
			if (req.soajs.servicesConfig.endPointConfig.headers) {
				for (let i in req.soajs.servicesConfig.endPointConfig.headers) {
					SOAPHeaders[i] = req.soajs.servicesConfig.endPointConfig.headers[i];
				}
			}
		}
		else if (req.soajs.registry.custom && req.soajs.registry.custom.endPointConfig) {
			let soapHost = req.soajs.registry.custom.endPointConfig.host;
			
			soapWSDL = req.soajs.registry.custom.endPointConfig.wsdl;
			SOAPAction = req.soajs.registry.custom.endPointConfig.SOAPAction;
			
			if (req.soajs.registry.custom.endPointConfig.envelope) {
				SOAPEnvelope = req.soajs.registry.custom.endPointConfig.envelope;
			}
			
			if (req.soajs.registry.custom.endPointConfig.headers) {
				for (let i in req.soajs.registry.custom.endPointConfig.headers) {
					SOAPHeaders[i] = req.soajs.registry.custom.endPointConfig.headers[i];
				}
			}
		}
		
		// match with resource and fetch host, username and password
		let authorization = utils.getMySchema(req)._authorization; // this route auth method
		let authorizationResource = req.soajs.registry.resources.authorization[authorization];
		
		if (authorizationResource && authorizationResource.config) {
			soapAPI = authorizationResource.config.host;
			soapAuth = {
				username: authorizationResource.config.username,
				password: authorizationResource.config.password
			};
		}
		
		if (!soapAuth || !soapAPI || !soapWSDL || !SOAPAction) {
			let missingField = !soapAuth ? "Soap Auth" : !soapAPI ? "Soap API" : !soapWSDL ? "Soap WSDL" : !SOAPAction ? "Soap Action" : "";
			let error = {
				code: 406,
				message: `Invalid end point configuration! missing: [${missingField}]`
			};
			return res.soajs.returnAPIResponse(req, res, {code: error.code, error: error, data: null});
		}
		
		
		let params = {
			api: soapAPI,
			wsdl: soapWSDL,
			SOAPAction: SOAPAction,
			headers: SOAPHeaders,
			operation: req.url,
			method: req.originalMethod.toUpperCase(),
			body,
			auth: soapAuth,
			SOAPEnvelope: SOAPEnvelope
		};
		
		req.soajs.log.debug(params);
		req.soajs.model.request(req.soajs, params, function (error, response) {
			if (error) {
				req.soajs.log.error(error);
				
				let error = {
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