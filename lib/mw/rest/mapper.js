"use strict";

const async = require("async");
const request = require('request');
const trigger_delete_from = ["headers", "body", "qs"];
const trigger_augment_from = ["request", "serviceConfig", "map"];
const trigger_uri_from = ["serviceConfig", "map"];
const request_map_from = ["headers", "query", "body"];
const response_map_from = ["request", "serviceConfig", "map"];
const response_augment_from = ["serviceConfig", "map"];

let mapper = {
    trigger: (holder, cb) => {
        if (holder.config.label && holder.config.uri && holder.config.route) {
            let requestOptions = {
                'timeout': 1000 * 3600,
            };

            if (holder.config.uri) {
                if (typeof holder.config.uri === 'string')
                    requestOptions.uri = holder.config.uri + holder.config.route;
                else {
                    let fromPath = holder.config.uri;
                    if (fromPath.from && fromPath.path) {
                        if (trigger_uri_from.indexOf(fromPath.from) === -1)
                            return cb(holder.config.label + " trigger augment from can only be one of: " + trigger_uri_from.join());
                        //TODO: need to support path var.var.var
                        //requestOptions.uri = holder[fromPath.from][fromPath.path];
                        requestOptions.uri = lib.pathResolve(fromPath.path, holder[fromPath.from]);
                        requestOptions.uri = requestOptions.uri + holder.config.route;
                    }
                    else {
                        return cb(holder.config.label + " trigger uri requires the following [from, path]");
                    }
                }
            }

            if (holder.config.timeout && holder.config.timeout > 1000)
                requestOptions.timeout = holder.config.timeout;

            if (holder.config.json)
                requestOptions.json = true;

            if (holder.config.method)
                requestOptions.method = holder.config.method.toUpperCase();

            if (holder.config.augment && Array.isArray(holder.config.augment)) {
                for (let i = 0; i < holder.config.augment.length; i++) {
                    let value = null;
                    let what = Object.keys(holder.config.augment[i])[0];
                    let fromPath = holder.config.augment[i][what];
                    if (fromPath.from && fromPath.path) {
                        if (trigger_augment_from.indexOf(fromPath.from) === -1)
                            return cb(holder.config.label + " trigger augment from can only be one of: " + trigger_augment_from.join());
                        //TODO: need to support path var.var.var
                        //value = holder[fromPath.from][fromPath.path];
                        value = lib.pathResolve(fromPath.path, holder[fromPath.from]);
                    }
                    else {
                        if (fromPath.value)
                            value = fromPath.value;
                        else
                            return cb(holder.config.label + " trigger augment requires the following [from, path] or [value]");
                    }

                    if (fromPath.what) {
                        if (!requestOptions[what])
                            requestOptions[what] = {};
                        requestOptions[what][fromPath.what] = value;
                    }
                    else
                        requestOptions[what] = value;
                }
            }

            if (holder.config.remove && Array.isArray(holder.config.remove)) {
                for (let i = 0; i < holder.config.remove.length; i++) {
                    let fromPath = holder.config.remove[i];
                    if (fromPath.from && fromPath.paths && Array.isArray(fromPath.paths)) {
                        if (trigger_delete_from.indexOf(fromPath.from) === -1)
                            return cb(holder.config.label + " trigger remove from can only be one of: " + trigger_delete_from.join());
                        for (let j = 0; j < fromPath.paths.length; j++) {
                            //TODO need to support path var.var.var
                            if (requestOptions[fromPath.from][fromPath.paths[j]])
                                delete requestOptions[fromPath.from][fromPath.paths[j]];
                        }
                    }
                    else {
                        return cb(holder.config.label + " trigger remove requires the following [from, paths]");
                    }
                }
            }

            if (requestOptions.body) {
                if (!requestOptions.json)
                    requestOptions.body = JSON.stringify(requestOptions.body);
            }

            holder.request.soajs.log.debug(requestOptions);
            let redirectedRequest = request(requestOptions);
            redirectedRequest.on('error', function (err) {
                return cb(err.toString());
            });
            if (holder.lastStage.passthrough && holder.lastStage.passthrough.from && holder.lastStage.passthrough.from === holder.config.label) {
                if (requestOptions.method === 'POST' || requestOptions.method === 'PUT') {
                    holder.request.pipe(redirectedRequest).pipe(holder.response);
                } else {
                    redirectedRequest.pipe(holder.response);
                }
            }
            else {
                redirectedRequest.on('response', function (response) {
                    response.on('data', function (data) {
                        if (holder.config.map) {
                            let textChunk = data.toString('utf8');
                            if (requestOptions.json)
                                textChunk = JSON.parse(textChunk);
                            let whatToMap = Object.keys(holder.config.map);
                            for (let i = 0; i < whatToMap.length; i++) {
                                let fromPath = holder.config.map[whatToMap[i]];
                                if (fromPath && fromPath.path) {
                                    if (requestOptions.json) {
                                        //TODO: need to support path headers.var.var
                                        //holder.map[whatToMap[i]] = textChunk[fromPath.path];
                                        holder.map[whatToMap[i]] = lib.pathResolve(fromPath.path, textChunk);
                                    }
                                    else {
                                        return cb(holder.config.label + " trigger map path is only supported when the response is json");
                                    }
                                }
                                else if (fromPath && fromPath.match) {
                                    if (fromPath.match instanceof RegExp) {
                                        holder.map[whatToMap[i]] = textChunk.match(fromPath.match);
                                    }
                                    else {
                                        return cb(holder.config.label + " trigger map match requires a valid regex. example: /[0-9]+(.[0-9]+)?/");
                                    }
                                }
                                else {
                                    return cb(holder.config.label + " trigger map requires the following [path]");
                                }
                            }
                        }
                        holder.map[holder.config.label] = data;
                        return cb(null, holder);
                    });
                });
            }
        }
        else {
            return cb("trigger requires the following [uri || uri, label, route]");
        }
    },
    let: (holder, cb) => {
        if (holder.config.map) {
            let whatToMap = Object.keys(holder.config.map);
            for (let i = 0; i < whatToMap.length; i++) {
                holder.map[whatToMap[i]] = holder.config.map[whatToMap[i]]
            }
        }
        else {
            return cb(holder.config.label + " let requires the following [map]");
        }
        return cb(null, holder);
    },
    request: (holder, cb) => {
        if (holder.config.map) {
            let whatToMap = Object.keys(holder.config.map);
            for (let i = 0; i < whatToMap.length; i++) {
                let fromPath = holder.config.map[whatToMap[i]];
                if (typeof fromPath === 'string') {
                    if (request_map_from.indexOf(fromPath) === -1)
                        return cb(holder.config.label + " request map from can only be one of: " + request_map_from.join());
                    holder.map[whatToMap[i]] = holder.request[fromPath]
                }
                else {
                    if (fromPath.from && fromPath.path) {
                        if (request_map_from.indexOf(fromPath.from) === -1)
                            return cb(holder.config.label + " request map from can only be one of: " + request_map_from.join());
                        //TODO: need to support path headers.var.var
                        //holder.map[whatToMap[i]] = holder.request[fromPath.from][fromPath.path];
                        holder.map[whatToMap[i]] = lib.pathResolve(fromPath.path, holder.request[fromPath.from]);
                    }
                    else {
                        return cb(holder.config.label + " request map requires the following [from, path]");
                    }
                }
            }
        }
        else {
            return cb(holder.config.label + " request requires the following [map]");
        }
        return cb(null, holder);
    },
    response: (holder, cb) => {
        if (holder.config.passthrough || holder.config.build) {
            if (holder.config.passthrough) {
                if (holder.config.passthrough.from) {
                    return cb("The response passthrough [from: " + holder.config.passthrough.from + "], did not match any trigger");
                }
                else {
                    return cb("response passthrough requires the following [from]");
                }
            }
            else {
                if (holder.config.build.answer) {
                    let fromPath = holder.config.build.answer;
                    let value = null;
                    if (fromPath.from && fromPath.path) {
                        if (trigger_augment_from.indexOf(fromPath.from) === -1)
                            return cb(holder.config.label + " response data from can only be one of: " + response_map_from.join());
                        //TODO: need to support path var.var.var
                        value = holder[fromPath.from][fromPath.path];
                    }
                    else {
                        if (fromPath.value)
                            value = fromPath.value;
                        else
                            return cb(holder.config.label + " response data requires the following [from, path] or [value]");
                    }
                    holder.answer = value;
                }
                if (holder.config.build.augment) {
                    for (let i = 0; i < holder.config.build.augment.length; i++) {
                        let value = null;
                        let what = Object.keys(holder.config.build.augment[i])[0];
                        if (what !== "headers") {
                            return cb(holder.config.label + " response augment can only augment [headers] for now");
                        }
                        let fromPath = holder.config.build.augment[i][what];
                        if (fromPath.from && fromPath.path) {
                            if (trigger_augment_from.indexOf(fromPath.from) === -1)
                                return cb(holder.config.label + " response augment from can only be one of: " + response_augment_from.join());
                            //TODO: need to support path var.var.var
                            value = holder[fromPath.from][fromPath.path];
                        }
                        else {
                            if (fromPath.value)
                                value = fromPath.value;
                            else
                                return cb(holder.config.label + " response augment requires the following [from, path] or [value]");
                        }
                        if (fromPath.what) {
                            holder.response.setHeader(fromPath.what, value);
                        }
                    }
                }
                if (holder.config.build.status) {
                    holder.response.statusCode = holder.config.build.status;
                }
                else {
                    holder.response.statusCode = 200;
                }

                holder.response.end(holder.answer);
                return cb(null, holder);
            }
        }
        else {
            return cb("response requires the following [passthrough, build]");
        }
    }
};
let lib = {
    pathResolve: (sourcePath, obj) => {
        if (sourcePath && obj) {
            let traversed = obj;
            let path = sourcePath.split(".");

            let next = path.shift();
            while (next) {
                if (Object.hasOwnProperty.call(traversed, next)) {
                    traversed = traversed[next];
                    next = path.shift();
                }
                else {
                    traversed = null;
                    break;
                }
            }
            return traversed;
        }
        return null;
    },
    getRoute: (url) => {
        if (url) {
            let route = url;
            let interrogationIndex = route.indexOf("?");
            if (interrogationIndex !== -1)
                route = route.substring(0, interrogationIndex);
            if (route.lastIndexOf("/") === (route.length - 1))
                route = route.substring(0, route.length - 1);
            return route
        }
        return null;
    },
    parseMapper: (mapperArray, pipeline, req, res, cb) => {
        let error = null;
        let holder = {};
        holder.request = req;
        holder.response = res;
        holder.map = {};
        holder.serviceConfig = {};

        let epServiceName = req.soajs.config.serviceName;
        let spServiceConf = null;
        if (req.soajs.servicesConfig && req.soajs.servicesConfig[epServiceName]) {
            spServiceConf = req.soajs.servicesConfig[epServiceName];
        }
        else if (req.soajs.registry.custom && req.soajs.registry.custom[epServiceName] && req.soajs.registry.custom[epServiceName].value) {
            spServiceConf = req.soajs.registry.custom[epServiceName].value;
        }
        holder.serviceConfig = spServiceConf;

        let lastStageName = mapperArray[mapperArray.length - 1];
        let lastStage = pipeline[lastStageName];
        if (!lastStage)
            return ("Unable to find stage [" + lastStageName + "] in your pipeline");

        let mKey = Object.keys(lastStage);
        if (mKey.length === 1 && mKey[0] === 'response') {
            holder.lastStage = lastStage.response;
            let mapperPipeline = [function (cb) {
                cb(null, holder);
            }];
            for (let i = 0; i < mapperArray.length; i++) {
                let stageName = mapperArray[i];
                let stage = pipeline[stageName];
                if (!stage) {
                    error = ("Unable to find stage [" + stageName + "] in your pipeline");
                    break;
                }
                else {
                    let keys = Object.keys(stage);
                    if (keys.length === 1) {
                        switch (keys[0]) {
                            case "request":
                                mapperPipeline.push((holder, cb) => {
                                    holder.config = stage[keys[0]];
                                    mapper.request(holder, cb);
                                });
                                break;
                            case "let":
                                mapperPipeline.push((holder, cb) => {
                                    holder.config = stage[keys[0]];
                                    mapper.let(holder, cb);
                                });
                                break;
                            case "trigger":
                                mapperPipeline.push((holder, cb) => {
                                    holder.config = stage[keys[0]];
                                    mapper.trigger(holder, cb);
                                });
                                break;
                            case "response":
                                mapperPipeline.push((holder, cb) => {
                                    holder.config = stage[keys[0]];
                                    mapper.response(holder, cb);
                                });
                                break;
                        }
                    }
                    else {
                        error = "Only one condition per entry. detected [" + keys.join() + "]";
                        break;
                    }
                }
            }
            if (error)
                return (error);
            else {
                async.waterfall(mapperPipeline, (error) => {
                    if (error) {
                        return cb(error);
                    }
                    return cb(null);
                });
            }
        }
        else {
            return ("The last stage of your pipeline must be a response");
        }
    }
};

let states = {
    "mw": (req, res) => {
        if (req && req.soajs && req.soajs.config && req.soajs.config.mapper && req.soajs.config.mapper.pipeline && req.soajs.config.mapper.apis) {
            let route = lib.getRoute(req.url);
            if (route) {
                let mapper = req.soajs.config.mapper.apis[route];
                if (mapper) {
                    if (Array.isArray(mapper)) {
                        lib.parseMapper(mapper, req.soajs.config.mapper.pipeline, req, res, (error) => {
                            if (error) {
                                let errorObject = {
                                    code: 405,
                                    message: error
                                };
                                return res.soajs.returnAPIResponse(req, res, {
                                    code: errorObject.code,
                                    error: errorObject,
                                    data: null
                                });
                            }
                        });
                    }
                    else {
                        let errorObject = {
                            code: 405,
                            message: "Mapper entry in your config should be an array for route: " + route
                        };
                        return res.soajs.returnAPIResponse(req, res, {
                            code: errorObject.code,
                            error: errorObject,
                            data: null
                        });
                    }
                }
                else {
                    let errorObject = {
                        code: 405,
                        message: "Unable to find a mapper entry in your config for route: " + route
                    };
                    return res.soajs.returnAPIResponse(req, res, {
                        code: errorObject.code,
                        error: errorObject,
                        data: null
                    });
                }
            }
            else {
                let errorObject = {code: 405, message: "Unable to fetch route from url"};
                return res.soajs.returnAPIResponse(req, res, {
                    code: errorObject.code,
                    error: errorObject,
                    data: null
                });
            }
        }
        else {
            let errorObject = {
                code: 405,
                message: "Unable to find mapper with pipeline and apis in your configuration"
            };
            return res.soajs.returnAPIResponse(req, res, {
                code: errorObject.code,
                error: errorObject,
                data: null
            });
        }
    }
};
module.exports = states;