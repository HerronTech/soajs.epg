"use strict";

let utils = {
	getMySchema: function getMySchema(req) {
		let schema = req.url;
		let interrogationIndex;
		if ((interrogationIndex = schema.indexOf("?")) !== -1) {
			schema = schema.substring(0, interrogationIndex);
		}
		
		return req.soajs.config.schema[req.originalMethod.toLowerCase()][schema];
	}
};

module.exports = utils;