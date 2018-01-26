var endpoint = {
	"type": "service",
	"dbs": [],
	"prerequisites": {
		"cpu": "",
		"memory": ""
	},
	"serviceName": "endpointExample1",
	"allowedBidsInit": 50,
	"injection": false,
	"serviceGroup": "ep",
	"serviceVersion": 1,
	"servicePort": 4100,
	"requestTimeout": 30,
	"oauth": false,
	"extKeyRequired": false,
	"requestTimeoutRenewal": 5,
	"models": {
		"path": "%%__dirname%%/lib/model/",
		"name": "rest"
	},
	"errors": {
		"400": "Error Connecting to Database"
	},
	"schema": {
		"get": {
			"/test": {
				"_apiInfo": {
					"l": "test",
					"group": "ep"
				},
				"mw": "%%__dirname%%/lib/mw/rest/index.js",
				"imfv": {
					"commonFields": [],
					"custom": {
						"input": {
							"source": ["query.input"],
							"required": false,
							"validation": {
								"type": "string"
							}
						}
					}
				}
			}
		},
		"post": {},
		"put": {},
		"delete": {}
		
	}
};

var service = {
	"_id": ObjectId("5a0e3680cab6a6e8fdbb548f"),
	"name": "endpointExample1",
	"group": "ep",
	"port": 4100,
	"swagger": false,
	"requestTimeout": 30,
	"requestTimeoutRenewal": 5,
	"versions": {
		"1": {
			"extKeyRequired": false,
			"urac": false,
			"urac_Profile": false,
			"urac_ACL": false,
			"provision_ACL": false,
			"oauth": false,
			"apis": [
				{
					"l": "test",
					"v": "/test",
					"m": "get",
					"group": "ep"
				}
			]
		}
	}
};