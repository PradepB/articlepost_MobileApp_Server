var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var secretKey = require("../config/config")
/**
 * @import { x, y as z, default as Default } from "express"
 */

var crypto = require('crypto');
var usermodel = require("../models/usermodel")
var crypto = require('crypto');
var salt = '1234567890';

/**
 * sample description -- free text
 * @module TokenGenrationModule
 * @function
 * @param req {Object} The request.
 * @param res {Object} The response.
 * @param req.body {Object} The JSON payload. Its contain user details to generate token.
 * @param {Function} next
 * @return {Object} returns genrated token
 */

router.post('/userloginVerification', function (req, res, next) {
  var data = req.body;
  if (!data.email || !data.password) {
    console.log("===")
    console.log(req.body)
    util.writeLog('Invalid Data! username and password both are required', 'post:/routes/tokenGenration');
    var error = new Error();
    error.success = false;
    error.status = 400;
    error.message = 'Invalid Data! username and password both are required';
    return res.send(error);
  }

  var hash = crypto.pbkdf2Sync(data.password, salt, 1000, 24, 'sha512');
  var userStore = {};
  userStore = {
    username: data.email,
    password: (new Buffer(hash).toString('hex')),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  console.log(userStore)
  const vCreateUser = usermodel.validateUser('users', userStore)
  vCreateUser.then((data) => {
    console.log(data)
    if (data.response.length > 0) {
      if (data.success) {
        const id = { id: data.response[0]._id }

        const token = jwt.sign(id, secretKey.secretKey)
        const tokenObj = {
          token: token
        }
        return res.send({ ...tokenObj, ...data })
      }
    }
    else {
      let tokenObj = {
        success: false,
        status: 403,
        message: 'Incorrect usename and password'
      }
      return res.send(tokenObj)
    }
  })
});

/**
 * 
 * @module TokenGenrationModule 
 * @function
 * @param req {Object} The request.
 * @param res {Object} The response.
 * @param req.body {Object} The JSON payload.
 * @param {Function} next
 * @return {undefined}
 */

router.post('/sample', function (req, res, next) {
  var data = req.body;
  if (!data.username || !data.password) {
    util.writeLog('Invalid Data! username and password both are required', 'post:/routes/tokenGenration');
    var error = new Error();
    error.success = false;
    error.status = 400;
    error.message = 'Invalid Data! username and password both are required';
    return res.send(error);
  }
  var hash = crypto.pbkdf2Sync(data.password, salt, 1000, 24, 'sha512');
  var userStore = {};
  userStore = {
    username: data.username,
    superAdmin: data.superAdmin,
    password: (new Buffer(hash).toString('hex')),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const vCreateUser = usermodel.validateUser('users', userStore)
  vCreateUser.then((data) => {
    if (data.response.length > 0) {
      if (data.success) {
        const id = { id: data.response[0]._id }

        const token = jwt.sign(id, secretKey.secretKey)
        const tokenObj = {
          token: token
        }
        return res.send({ ...tokenObj, ...data })
      }
    }
    else {
      let tokenObj = {
        success: false,
        status: 403,
        message: 'Incorrect usename and password'
      }
      return res.send(tokenObj)
    }
  })
});





module.exports = router;
