"use strict";

const request = require('request');

const Mongo = require("soajs").mongo;
const soajsUtils = require("soajs").utils;

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

function getEndpointAndCreateConfig(dbInfo) {
    let MongoClient = new Mongo(dbInfo);
    let endpointsCollection = "api_builder_endpoints";
    let condition = {
        serviceName: process.env.SOAJS_ENDPOINT_NAME
    };

    /**
     * to set [mw] on each route and [models path] on the endpoint
     *
     * @param endpoint
     */
    let fixEndpointDynamicVariables = (endpoint) => {
        let schema = endpoint.schema;
        let schemaKeys = Object.keys(schema); // get/post/...

        schemaKeys.forEach((key) => {
            if (key !== 'commonFields') {
                let routesWithin = Object.keys(schema[key]); // get: /route1
                routesWithin.forEach((eachRoute) => {
                    if (schema[key][eachRoute]) {
                        //let mw = schema[key][eachRoute]["mw"];
                        let driver = endpoint.models.name === 'soap' ? 'soap' : 'rest';
                        if (driver === 'rest' && endpoint.mapper){
                            endpoint.schema[key][eachRoute]["mw"] = __dirname + `/lib/mw/${driver}/mapper.js`;
                        }
                        else
                            endpoint.schema[key][eachRoute]["mw"] = __dirname + `/lib/mw/${driver}/index.js`;
                    }
                });
            }
        });

        if (endpoint.models && endpoint.models.path) {
            endpoint.models.path = __dirname + "/lib/model/";
        }
        delete endpoint._id;
    };

    /**
     * turn on service using composer
     *
     * @param configFile
     */
    let turnOnService = (configFile) => {
        let composer = require("soajs.composer");
        if (process.env.SOAJS_DEPLOY_MANUAL && configFile)
            configFile.mw = 1;
        composer.deploy(configFile, function (error) {
            MongoClient.closeDb();
            if (error) {
                throw new Error(error);
            }
        });
    };

    MongoClient.findOne(endpointsCollection, condition, (err, item) => {
        if (err) {
            return cb(err);
        }
        if (!item) {
            throw new Error("No Endpoint System found for: " + process.env.SOAJS_ENDPOINT_NAME);
        }

        fixEndpointDynamicVariables(item);

        turnOnService(item);
    });
}

getCoreProvisionInfoFromController((error, dbInfo) => {
    if (error) {
        throw new Error(error);
    }
    getEndpointAndCreateConfig(dbInfo);

});