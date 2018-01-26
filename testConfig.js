"use strict";

var services = {
	"type": "service",
	"dbs": [],
	"prerequisites": {
		"cpu": "",
		"memory": ""
	},
	"serviceName": "endpoint",
	"allowedBidsInit": 50,
	"injection": true,
	"serviceGroup": "ep",
	"serviceVersion": 1,
	"servicePort": 4100,
	"requestTimeout": 30,
	"oauth": false,
	"extKeyRequired": false,
	"requestTimeoutRenewal": 5,
	"models": {
		"path": __dirname + "/lib/model/",
		"name": "rest"
	},
	"errors": {
		400: "Error Connecting to Database"
	},
	"schema": {
		"get": {},
		"post": {
			"/soap": {
				"_apiInfo": {
					"l": "soap",
					"group": "ep"
				},
				"mw": __dirname + "/lib/mw/soap/index.js",
				"imfv": {
					"commonFields": [],
					"custom": {}
				}
			},
			"/rest": {
				"_apiInfo": {
					"l": "rest",
					"group": "ep"
				},
				"_authorization": "COTT",
				"mw": __dirname + "/lib/mw/rest/index.js",
				"imfv": {
					"commonFields": [],
					"custom": {
						"key": {
							"required": true,
							"source": ["headers.key"],
							"validation": {
								"type": "string"
							}
						},
						"username": {
							"required": true,
							"source": ["query.username"],
							"validation": {
								"type": "string"
							}
						}
					}
				}
			}
		},
		"put": {},
		"delete": {}
		
	}
};

module.exports = services;