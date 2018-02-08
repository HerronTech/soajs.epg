"use strict";

const url = require('url');

/**
 * merge two objects and return them
 *
 * @param req
 * @param obj1
 * @param obj2
 * @returns {*}
 */
function merge2Objects(req, obj1, obj2) {
	let output = {};
	
	if (!obj1 || !obj2) {
		if (!obj1 && !obj2) {
			return {};
		}
		if (!obj1) {
			return obj2;
		}
		if (!obj2) {
			return obj1;
		}
	} else {
		if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
			req.soajs.log.error("Unexpected types!");
			return {};
		} else {
			let obj1Keys = Object.keys(obj1);
			let obj2Keys = Object.keys(obj2);
			
			obj1Keys.forEach(function (obj1Each) {
				output[obj1Each] = obj1[obj1Each];
			});
			
			obj2Keys.forEach(function (obj2Each) {
				output[obj2Each] = obj2[obj2Each];
			});
			return output;
		}
	}
}

let utils = {
	merge2Objects,
	
	/**
	 * merge the url, body, qs, headers & method of 2 objects provided
	 *
	 * @param req
	 * @param param1
	 * @param param2
	 * @returns {{url: *, body: ({}|*), qs: ({}|*), headers: ({}|*), method: *}}
	 */
	merge2Params: function merge2Params(req, param1, param2) {
		return {
			url: param1.url || param2.url,
			body: merge2Objects(req, param1.body, param2.body),
			qs: merge2Objects(req, param1.qs, param2.qs),
			headers: merge2Objects(req, param1.headers, param2.headers),
			method: param1.method || param2.method
		};
	},
	
	/**
	 * get Schema configuration from the request
	 * common fields are also merged with the output
	 *
	 * @param req
	 */
	getMySchema: function getMySchema(req) {
		let schema = req.url;
		let interrogationIndex;
		if ((interrogationIndex = schema.indexOf("?")) !== -1) {
			schema = schema.substring(0, interrogationIndex);
		}
		
		let output = req.soajs.config.schema[req.originalMethod.toLowerCase()][schema];
		
		// append commonFields to output
		if(req.soajs.config.schema[req.originalMethod.toLowerCase()][schema].commonFields){
			let common = req.soajs.config.schema[req.originalMethod.toLowerCase()][schema].commonFields;
			common.forEach(function (each) {
				output[each] = req.soajs.config.schema.commonFields[each];
			});
		}
		
		return output;
	},
	
	cleanUrl : function (from, to) {
		return url.resolve(from, to);
	}
};

module.exports = utils;