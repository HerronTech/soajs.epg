"use strict";
let customScript; // applicable for custom auth only

/**
 *
 * @param req
 * @param res
 * @param authorization
 * @param cb(addOnsParams) : additional parameters to be added to the main request
 * @returns {*}
 */
function authorize(req, res, authorizationResource, authorization, cb) {
	
	// todo: if !authorizationResource
	
	let authDataParams = authorizationResource.config;
	
	let headers = {}, body = {}, qs = {};
	let preRequestHeaders = {}, preRequestBody = {}, preRequestQs = {}; // applicable only for oauth2 so far
	let addOnsParams = {
		body,
		qs,
		headers
	};
	
	// will be updated with url and method applied
	// data within will only be used in this function
	let preRequestParams = {
		headers: preRequestHeaders,
		body: preRequestBody,
		qs: preRequestQs
	};
	
	let nonce = require('nonce')()();
	let timestamp = Date.now();
	
	let customScriptData; // applicable for custom mode only
	
	if (authorizationResource) { // TODO: REMOVE: MUST BE done before
		switch (authorizationResource.category) {
			case "mongo":
				// -=-=-=-=-=-=-=[]
				// let authInfo = req.soajs.registry.resources.cluster.abc.config;
				// TODO
				break;
			case "BasicAuth": // BasicAuth
				headers.Authorization = 'Basic ' + new Buffer(authDataParams.username + ':' + authDataParams.password).toString('base64');
				break;
			case "DigestAuth": // DigestAuth
				headers.Authorization = `Digest username="${authDataParams.username}", realm="${authDataParams.realm}", nonce="${authDataParams.realm}",` +
					`uri="${authDataParams.url}", response="${authDataParams.response}", opaque="${authDataParams.opaque}"`
				break;
			case "oauth1": // oauth1
				// todo encode each field
				body['oauth_consumer_key'] = authDataParams.consumerKey;
				body['oauth_token'] = authDataParams.consumerSecret;
				body['oauth_signature_method'] = authDataParams.signatureMethod;
				body['oauth_timestamp'] = authDataParams.timestamp || timestamp;
				body['oauth_nonce'] = authDataParams.nonce || nonce;
				body['oauth_version'] = authDataParams.version;
				body['oauth_signature'] = authDataParams.xxxxxx;
				
				break;
			case "oauth2": // oauth2
				preRequestParams.url = authDataParams.authUrl;
				preRequestParams.method = "get";
				
				preRequestBody['callbackUrl'] = authDataParams.callbackUrl;
				preRequestBody['tokenName'] = authDataParams.tokenName;
				preRequestBody['accessTokenUrl'] = authDataParams.accessTokenUrl;
				preRequestBody['clientId'] = authDataParams.clientId;
				preRequestBody['clientSecret'] = authDataParams.clientSecret;
				preRequestBody['scope'] = authDataParams.scope;
				preRequestBody['grantType'] = authDataParams.grantType;
				
				break;
			case "hawkAuth": // hawk
				body['hawkAuthId'] = authDataParams.hawkAuthId;
				body['hawkAuthKey'] = authDataParams.hawkAuthKey;
				body['algorithm'] = authDataParams.algorithm;
				body['user'] = authDataParams.user;
				body['nonce'] = authDataParams.nonce;
				body['extraData'] = authDataParams.extraData;
				body['appId'] = authDataParams.appId;
				body['delegation'] = authDataParams.delegation;
				body['timestamp'] = authDataParams.timestamp;
				break;
			case "awsSignature": // aws
				body['accessKey'] = authDataParams.accessKey;
				body['secretKey'] = authDataParams.secretKey;
				body['awsRegion'] = authDataParams.awsRegion;
				body['serviceName'] = authDataParams.serviceName;
				break;
			case "custom": // custom script
				customScriptData = authDataParams.configuration;
				req.soajs.log.debug("---- custom script data -----");
				req.soajs.log.debug(customScriptData);
				req.soajs.log.debug("---- custom script data -----");
				break;
			default:
				let error = {
					code: 407,
					message: "Unrecognised authorization type"
				};
				return res.soajs.returnAPIResponse(req, res, {code: error.code, error: error, data: null});
		}
	} else {
		let error = {
			code: 408,
			message: "Unrecognised authorization tag"
		};
		return res.soajs.returnAPIResponse(req, res, {code: error.code, error: error, data: null});
	}
	
	/**
	 * in case of oauth 2: request tokens in this function
	 */
	function preMainRequestOauth2() {
		req.soajs.model.request(preRequestParams, function (error, response, body) {
			if (error) {
				let errorObject = {
					code: 405,
					message: error.toString()
				};
				return res.soajs.returnAPIResponse(req, res, {code: errorObject.code, error: errorObject, data: null});
			} else {
				// TODO: update add ons params
				// probably body with token
				
				cb(addOnsParams);
			}
		});
	}
	
	/**
	 * in case of custom script: execute the script and append the params to the main call
	 *
	 * @returns {*}
	 */
	function preMainRequestCustomScript() {
		
		try {
			if (!customScript) {
				customScript = require("./../utils/customScript");
			}
			customScript(customScriptData, function (customAddOnParams) {
				if (!customAddOnParams || !customAddOnParams.qs || !customAddOnParams.body || !customAddOnParams.headers) {
					let error = {
						code: 411,
						message: "Please make sure that your callback include an object having (qs,body,headers)"
					};
					return res.soajs.returnAPIResponse(req, res, {code: error.code, error: error, data: null});
				} else {
					cb(customAddOnParams);
				}
			});
		} catch (exception) {
			let error = {
				code: 412,
				message: exception.toString()
			};
			return res.soajs.returnAPIResponse(req, res, {code: error.code, error: error, data: null});
		}
	}
	
	if (authorizationResource.category === "oauth2") {
		preMainRequestOauth2();
	} else if (authorizationResource.category === "custom") {
		preMainRequestCustomScript();
	} else {
		cb(addOnsParams);
	}
}

module.exports = {
	authorize
};