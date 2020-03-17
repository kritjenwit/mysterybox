// Bring All Node environment
const fs = require('fs');
const config = require('./config');
const axios = require('axios');
const store = require('./../store/index');
const state = store.default.state;
// -----------------------------
function killChars(string) {
	if (validateInput(string)) {
		return null;
	}

	string = typeof string == 'number' ? string.toString() : string;

	let badChars = [
		"select ", "insert ", "update ", "delete ", "drop ", "exec ", "execute ",
		"truncate ", "shutdown ", "create ", "sysobjects", "table ", "database ",
		"user ", "schema ", "adodb ", "master ", "cast(", "convert(", "char(",
		"db_name", " and ", " or ", "<script", "select+", "insert+", "update+",
		"delete+", "drop+", "exec+", "execute+", "truncate+", "shutdown+", "create+",
		"sysobjects+", "table+", "database+", "user+", "schema+", "adodb+", "master+",
		"+and+", "+or+", ";", "--", "xp_", "'", "- -", "' '", "%", "%20", "1=1", "*", "**",
		"=", "@@"
	];


	for (var i = 0; i < badChars.length; i++) {
		string = string.replace(badChars[i], '');
	}

	return string;
}


function isArray(data) {
	return Array.isArray(data);
}

function getIp(req) {
	let requestIp = req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		(req.connection.socket ? req.connection.socket.remoteAddress : null);

	requestIp = requestIp.replace('::ffff:', '');
	return requestIp;
}

function addZero(varname) {
	varname = typeof varname == 'number' ? varname.toString() : varname;
	varname = varname.length == 1 ? `0${varname}` : varname;
	return varname;
}

function date() {
	const date = new Date();
	let month = date.getMonth() + 1;
	let dateTime = date.getDate();

	month = addZero(month);
	dateTime = addZero(dateTime);

	return `${date.getFullYear()}-${month}-${dateTime}`;
}

function dateTime() {
	const objDate = new Date();
	let hour = addZero(objDate.getHours());
	let minute = addZero(objDate.getMinutes());
	let second = addZero(objDate.getSeconds());

	return `${date()} ${hour}:${minute}:${second}`;

}
function time() {
	return new Date().getTime().toString().substr(0, 10);
}

function unixtime() {
	return new Date().getTime().toString().substr(0, 10);
}

function base64encode(message) {
	return  new Buffer(message).toString('base64');
}

function writeLog(useridx,message) {
	const timestamp = time();

	const objDate = new Date();
	let hour = addZero(objDate.getHours());
	let minute = addZero(objDate.getMinutes());
	let second = addZero(objDate.getSeconds());

	const datetime = `${date()} ${hour}:${minute}:${second}`;

	const data = {
		useridx : useridx,
		ip_address : window.ipAddress,
		timestamp : unixtime(),
		datetime : datetime,
		message : base64encode(message),
	};

	//axios.post(`${config.apiUrl}/${config.api.logFile}`,data)
}

function validateInput(varname) {
	return !varname || varname.length == 0 || varname == (null || '' || undefined);
}

function isJson(str) {
	try {
		var json = JSON.parse(str);
		return (typeof json === 'object');
	} catch (e) {
		return false;
	}
}

module.exports = {
	killChars,
	isArray,
	dateTime,
	date,
	time,
	writeLog,
	validateInput,
	getIp,
	isJson,
}