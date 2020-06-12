var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var errorMsg = require('../utils/errors');
// var secretKey = 'yRQYnWzskCZUxPwaQupWkiUzKELZ49eM7oWxAQK_ZXw'
var secretKey= require("../config/config")

module.exports = ((req, res, callback) => {
	console.log(req.headers)
	console.log(req.headers['x-auth-token'])

	// JSON.stringify()
	if (!req.headers['x-auth-token']) {
		var err = errorMsg.getError('x-auth-token is required');
		return res.send(err);
	}
	if (req.headers['x-auth-token']) {
		var reqToken = req.headers['x-auth-token'];
		jwt.verify(reqToken, secretKey.secretKey, function (err, decoded) {
			//DETAILS : decoded contains t(required details), iat, exp
			if (err) {
				console.log('WebToken error: ' + err);
				if (err.name === 'TokenExpiredError') { // 'TokenExpiredError'
					res.statusCode = 307;
				} else {
					console.log(err.name + ' -- ' + reqToken);
					res.statusCode = 401; //error: JsonWebTokenError: invalid signature
				}
				return res.send((err));
			} else {
				console.log(decoded)
				req.username = decoded.id;
				// req.username = decoded.response[0].username;
				return callback();
			}
		});
	}
})
