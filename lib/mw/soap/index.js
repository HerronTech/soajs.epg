"use strict";

let utils = require("./../../utils/utils");

var states = {
	"request": function (req, res) {
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
		
		SOAPHeaders = utils.merge2Objects(req, SOAPHeaders, req.headers);
		
		let epServiceName = req.soajs.config.serviceName;
		if (req.soajs.servicesConfig && req.soajs.servicesConfig[epServiceName]) {
			soapWSDL = req.soajs.servicesConfig[epServiceName].wsdl;
			SOAPAction = req.soajs.servicesConfig[epServiceName].SOAPAction;
			
			if (req.soajs.servicesConfig[epServiceName].envelope) {
				SOAPEnvelope = req.soajs.servicesConfig[epServiceName].envelope;
			}
			
			if (req.soajs.servicesConfig[epServiceName].headers) {
				for (let i in req.soajs.servicesConfig[epServiceName].headers) {
					SOAPHeaders[i] = req.soajs.servicesConfig[epServiceName].headers[i];
				}
			}
		}
		else if (req.soajs.registry.custom && req.soajs.registry.custom[epServiceName]) {
			soapWSDL = req.soajs.registry.custom[epServiceName].wsdl;
			SOAPAction = req.soajs.registry.custom[epServiceName].SOAPAction;
			
			if (req.soajs.registry.custom[epServiceName].envelope) {
				SOAPEnvelope = req.soajs.registry.custom[epServiceName].envelope;
			}
			
			if (req.soajs.registry.custom[epServiceName].headers) {
				for (let i in req.soajs.registry.custom[epServiceName].headers) {
					SOAPHeaders[i] = req.soajs.registry.custom[epServiceName].headers[i];
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
			let error = {code: 406, message: `Invalid end point configuration! missing: [${missingField}]`};
			return res.soajs.returnAPIResponse(req, res, {code: error.code, error: error, data: null});
		}
		
		// map headers, query & body to soap call
		// append headers to SOAPHeaders / query&body to SOAPQueryAndBody
		let SOAPQueryAndBody = {};
		let schema = utils.getMySchema(req);
		let schemaKeys = Object.keys(schema);
		let schemaVariablesToSkip = ["_apiInfo", "_authorization"];
		schemaKeys.forEach(function (attribute) {
			if (schemaVariablesToSkip.indexOf(attribute) === -1) {
				let currentSources = schema[attribute].source;
				
				if (currentSources) {
					currentSources.forEach(function (source) {
						if (body[attribute]) {
							if (source.indexOf("query.") !== -1 || source.indexOf("params.") !== -1) {
								SOAPQueryAndBody[attribute] = body[attribute];
							}
							if (source.indexOf("body.") !== -1) {
								SOAPQueryAndBody[attribute] = body[attribute];
							}
							if (source.indexOf("headers.") !== -1) {
								SOAPHeaders[attribute] = body[attribute];
							}
						}
					});
				}
			}// else skip
		});
		
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
				let errorObject = {code: 405, message: error.toString()};
				return res.soajs.returnAPIResponse(req, res, {code: errorObject.code, error: errorObject, data: null});
			}
			
			return res.soajs.returnAPIResponse(req, res, {code: null, error: null, data: response});
		});
	}
};

module.exports = states;