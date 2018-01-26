String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};

var fs = require("fs");
fs.readFile('./customScript.js','utf8', function (err, data) {
	if (err) throw err;
	
	data = data.replace(/(?:\r\n|\r|\n)/g,"%%%"); // remove line breaks
	data = data.replaceAll("\t","    ");// tabs
	data = data.replaceAll("\"","\\\"");
	data = data.replaceAll("{","%%OPEN%%");
	data = data.replaceAll("}","%%CLOSE%%");
	console.log(data);
});

var x = "var customScript = function (customParamSent, cb) %%OPEN%%%%%    %%%    var request = require('request');%%%    request[\"get\"](%%OPEN%%uri:\"http://dashboard-api.soajs.org/oauth/authorization\",headers : %%OPEN%%\"key\":customParamSent.key%%CLOSE%%%%CLOSE%%, function (err1, response1, body1) %%OPEN%%%%%        let auth = JSON.parse(body1).data;%%%        request[\"post\"](%%OPEN%%uri:\"http://dashboard-api.soajs.org/oauth/token\",%%%            headers : %%OPEN%%\"key\":customParamSent.key,\"Authorization\":auth,'Content-Type': 'application/json'%%CLOSE%%,%%%            json: true,%%%            body:%%OPEN%%\"grant_type\" : \"password\",\"username\":customParamSent.userX,\"password\":customParamSent.passX%%CLOSE%%%%CLOSE%%, function (err2, response2, body2) %%OPEN%%%%%            let addOnsParams = %%OPEN%%%%%                qs : %%OPEN%%%%%                    access_token : body2.access_token%%%                %%CLOSE%%,%%%                body : %%OPEN%%%%CLOSE%%,%%%                headers : %%OPEN%%%%CLOSE%%%%%            %%CLOSE%%;%%%            cb(addOnsParams);%%%        %%CLOSE%%);%%%    %%CLOSE%%);%%%%%CLOSE%%;%%%module.exports = customScript;";