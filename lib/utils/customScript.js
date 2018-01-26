var customScript = function (customParamSent, cb) {
	var request = require('request');
	request["get"]({
		uri: "http://dashboard-api.soajs.org/oauth/authorization",
		headers: {"key": customParamSent.key}
	}, function (err1, response1, body1) {
		let auth = JSON.parse(body1).data;
		request["post"]({
			uri: "http://dashboard-api.soajs.org/oauth/token",
			headers: {"key": customParamSent.key, "Authorization": auth, 'Content-Type': 'application/json'},
			json: true,
			body: {"grant_type": "password", "username": customParamSent.userX, "password": customParamSent.passX}
		}, function (err2, response2, body2) {
			let addOnsParams = {
				qs: {
					access_token: body2.access_token
				},
				body: {},
				headers: {}
			};
			cb(addOnsParams);
		});
	});
};
module.exports = customScript;