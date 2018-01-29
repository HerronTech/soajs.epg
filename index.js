"use strict";

// var fs = require("fs");
let configFile;
var request = require('request');

var Mongo = require("soajs").mongo;
var soajsUtils = require("soajs").utils;
var MongoClient;

String.prototype.replaceAll = function (search, replacement) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};

function getCoreProvisionInfoFromController(cb) {
	
	if (!process.env.SOAJS_REGISTRY_API) {
		return cb(new Error("SOAJS_REGISTRY_API is undefined!"));
	}
	
	if (!process.env.SOAJS_ENV) {
		return cb(new Error("SOAJS_ENV is undefined!"));
	}
	
	if (!process.env.SOAJS_ENDPOINT_NAME) {
		return cb(new Error("SOAJS_ENDPOINT_NAME is undefined!"));
	}
	
	let options = {
		uri: "http://" + process.env.SOAJS_REGISTRY_API + "/getRegistry?env=" + process.env.SOAJS_ENV
	};
	request["get"](options, function (err, response, body) {
		if (err) {
			return cb(err);
		} else {
			let bodyAsObject = body;
			if (typeof bodyAsObject === 'string') {
				bodyAsObject = JSON.parse(bodyAsObject);
			}
			
			let dbConfig = soajsUtils.cloneObj(bodyAsObject.data.coreDB.provision);
			delete dbConfig.registryLocation;
			delete dbConfig.timeConnected;
			return cb(null, dbConfig);
		}
	});
}

function getEndpointAndCreateConfig(cb) {
	
	function fixEndpointDynamicVariables(endpoint) {
		let schema = endpoint.schema;
		let schemaKeys = Object.keys(schema); // get/post/...
		
		schemaKeys.forEach(function (key) {
			if(key!=='commonFields'){
				let routesWithin = Object.keys(schema[key]); // get: /route1
				routesWithin.forEach(function (eachRoute) {
					
					if (schema[key][eachRoute]) {
						let mw = schema[key][eachRoute]["mw"];
						let driver = endpoint.models.name === 'soap' ? 'soap' : 'rest';
						endpoint.schema[key][eachRoute]["mw"] = __dirname + `/lib/mw/${driver}/index.js`;
					}
				});
			}
		});
		
		if (endpoint.models && endpoint.models.path) {
			endpoint.models.path = __dirname + "/lib/model/";
		}
		
		// addidtional updates
		delete endpoint._id;
	}
	
	let endpointsCollection = "api_builder_endpoints";
	let condition = {
		serviceName: process.env.SOAJS_ENDPOINT_NAME
	};
	
	MongoClient.findOne(endpointsCollection, condition, (err, item) => {
		if (err) {
			return cb(err);
		}
		if (!item) {
			throw new Error("No Endpoint System found for: " + process.env.SOAJS_ENDPOINT_NAME);
		}
		
		
		fixEndpointDynamicVariables(item);
		
		if (item.customScript) {
			let cust = item.customScript;
			
			// to be discussed
			cust = cust.replaceAll("%%OPEN%%", "{");
			cust = cust.replaceAll("%%CLOSE%%", "}");
			cust = cust.replaceAll("%%%", "\n"); // restore line breaks
			// cust = cust.replaceAll("\t","    ");// tabs
			// cust = cust.replaceAll("\"","\\\"");
			
			
			let customScript = "var customScript = function (customParamSent, cb) {\n" + cust + "};\nmodule.exports = customScript;";
			fs.writeFile(__dirname + "/lib/utils/customScript.js", customScript, function () {
				delete item.customScript;
				configFile = item;
				cb();
				// let configOutput = "var services = \n" + JSON.stringify(item, null, 2) + ";\nmodule.exports = services;";
				// fs.writeFile(__dirname + "/config.js", configOutput, cb);
			});
		} else {
			configFile = item;
			cb();
			// let configOutput = "var services = \n" + JSON.stringify(item, null, 2) + ";\nmodule.exports = services;";
			// fs.writeFile(__dirname + "/config.js", configOutput, cb);
		}
	});
}

function turnOnService() {
	// delete process.env.SOAJS_REGISTRY_API;
	var composer = require("soajs.composer");
	composer.deploy(configFile, function (error) {
		MongoClient.closeDb();
		if (error) {
			throw new Error(error);
		} else {
			//ok
		}
	});
}

// // -=-=-=-=-= static test config
// var composer = require("soajs.composer");
// composer.deploy(__dirname + "/testConfig.js", function (error) {
// 	if (error) {
// 		throw new Error(error);
// 	} else {
// 		//ok
// 	}
// });

getCoreProvisionInfoFromController(function (error, dbInfo) {
	if (error) {
		throw new Error(error);
	}
	
	MongoClient = new Mongo(dbInfo);
	getEndpointAndCreateConfig(turnOnService);
	
});