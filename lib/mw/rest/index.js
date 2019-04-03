"use strict";

let authUtils = require("./../../utils/authorization");
let utils = require("./../../utils/utils");

let chachedAuthParams = {}; // per authMethod
let cachingTime = {}; // per authMethod

let states = {
    "authorize": function (req, res, next) {
        console.log(req.soajs.config)
        let authorization = utils.getMySchema(req)._authorization; // this route auth method

        if (authorization) {
            let authorizationResource = req.soajs.registry.resources.authorization[authorization];
            let currentTime = Date.now() / 1000; // in seconds
            if (authorizationResource.cachingEnabled && chachedAuthParams[authorization] && currentTime < (cachingTime[authorization] + authorizationResource.ttl)) {
                req.soajs.authAddOnsParams = chachedAuthParams[authorization];
                next();
            } else {
                authUtils.authorize(req, res, authorizationResource, authorization, function (authParams) {
                    req.soajs.authAddOnsParams = authParams;

                    cachingTime[authorization] = Date.now() / 1000; // in seconds
                    chachedAuthParams[authorization] = authParams;

                    next();
                });
            }
        } else {
            next();
        }
    },

    "request": function (req, res) {
        let restUrl;
        let epServiceName = req.soajs.config.serviceName;
        let spServiceConf = null;
        if (req.soajs.servicesConfig && req.soajs.servicesConfig[epServiceName]) {
            spServiceConf = req.soajs.servicesConfig[epServiceName];
        }
        else if (req.soajs.registry.custom && req.soajs.registry.custom[epServiceName] && req.soajs.registry.custom[epServiceName].value) {
            spServiceConf = req.soajs.registry.custom[epServiceName].value;
        }

        if (spServiceConf) {
            if (spServiceConf.url)
                restUrl = spServiceConf.url;
            else if (spServiceConf.host) {
                let restHost = spServiceConf.host;
                if (restHost && restHost.protocol && restHost.domain) {
                    restUrl = restHost.protocol + "://" + restHost.domain;
                    if (restHost.port)
                        restUrl += ":" + restHost.port;
                }
            }
            if (spServiceConf.request && spServiceConf.request.headers) {
                for (let h in spServiceConf.request.headers) {
                    if (spServiceConf.request.headers.hasOwnProperty(h)) {
                        req.headers[h] = spServiceConf.request.headers[h];
                    }
                }
            }
        }

        if (!restUrl) {
            let error = {code: 406, message: "Invalid base url! check the provision configuration"};
            return res.soajs.returnAPIResponse(req, res, {code: error.code, error: error, data: null});
        }
        let urlToCall = (req.url.charAt(0) === '/') ? "" : "/";
        urlToCall += req.url;

        restUrl = restUrl + urlToCall;

        // merge authentication request params
        if (req.soajs.authAddOnsParams) {
            let mergedParams = utils.merge2Params(req, req, req.soajs.authAddOnsParams);
            req.qs = mergedParams.qs;
            req.body = mergedParams.body;
            req.headers = mergedParams.headers;
        }
        // clean the header before requesting
        if (req && req.headers && req.headers.key)
            delete req.headers.key;
        if (req && req.headers && req.headers.soajsinjectobj)
            delete req.headers.soajsinjectobj;
        if (req && req.headers && req.headers.host)
            delete req.headers.host;

        let reqJson = false;
        if (spServiceConf && spServiceConf.request && pServiceConf.request.json)
            reqJson = true;

        req.soajs.model.request(req, res, restUrl, reqJson, function (error, response, body) {
            if (error) {
                let errorObject = {code: 405, message: error.toString()};
                return res.soajs.returnAPIResponse(req, res, {
                    code: errorObject.code,
                    error: errorObject,
                    data: null
                });
            }
            return res.soajs.returnAPIResponse(req, res, {code: null, error: null, data: body});
        });


    }
};

module.exports = states;
