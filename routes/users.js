var express = require('express');
var router = express.Router();
var usermodel = require("../models/usermodel")
var postmodel = require("../models/postmodel")
var ObjectID = require('mongodb').ObjectID;
var crypto = require('crypto');
var util = require("../utils/util");
var secretKey = require("../config/config")
var jwt = require('jsonwebtoken');

/**
 * 
 * @module UserModule
 * @function
 * @path {POST} /users/createUser
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain user details to generate token.
 * @param {Function} next
 * @body {String}
 * @return {Object} returns genrated token
 */
router.post('/createUser', (req, res) => {
  var data = req.body;
  if (!data.email || !data.password) {
    util.writeLog('Invalid Data! username and password both are required', 'post:/merck/users');
    var error = new Error();
    error.success = false;
    error.status = 400;
    error.message = 'Invalid Data! username and password both are required';
    res.send(error);
  }

  var salt = '1234567890'; // default salt
  var hash = crypto.pbkdf2Sync(data.password, salt, 1000, 24, 'sha512');
  var userStore = {};

  userStore = {
    username: data.email,
    email: data.email,
    name: data.name,
    password: (Buffer.from(hash).toString('hex')),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const vCreateUser = usermodel.createUser('users', userStore)
  vCreateUser.then((data) => {
    console.log(data)
    res.status(200).send(data)
  }).catch(err => {
    util.writeLog('createUser Error', 'post:/users/createUser');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'User not created';
    res.send(error);
  })

})

router.put('/updateUser/:id', (req, res) => {
  let useData = req.body

  let userStore = {
    firstname: useData.firstname,
    lastname: useData.lastname,
    mobile: useData.mobile,
    username: useData.email,
    email: useData.email,
    role: useData.role,
    updatedAt: new Date(),
    status: useData.status,
    updatedBy: ObjectID(useData.updatedBy),
  };



  if ('password' in useData) {
    var salt = '1234567890'; // default salt
    var hash = crypto.pbkdf2Sync(useData.password, salt, 1000, 24, 'sha512');
    userStore['password'] = (Buffer.from(hash).toString('hex'))
  }

  const vUpdateUser = usermodel.updateUser('users', userStore, req.params.id)
  vUpdateUser.then((data) => {
    res.status(200).send(data)
  })
})

router.get('/getUser/:id', (req, res) => {
  if (req.params.id) {
    var id = req.params.id;
    var vGetUser = usermodel.getSingleUser('users', id)
    vGetUser.then((data) => {
      if (data.message) {
        res.status(404).send(data)
      }
      res.status(200).send(data)
    }).catch(err => {
      util.writeLog('getUser Error', 'get:/users/getUser/:id');
      var error = new Error();
      error.success = false;
      error.status = 404;
      error.message = 'User not found ';
      res.send(error);
    })
  } else {
    util.writeLog('getUser Error', 'get:/users/getUser/:id');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'Userid not found ';
    res.send(error);
  }

})

router.delete('/deleteUser/:id', (req, res) => {
  if (req.params.id != undefined || req.params.id != 'undefined' || req.params.id != null) {
    let id = req.params.id;

    var vDeleteUser = usermodel.deleteUser('users', id)
    vDeleteUser.then((data) => {
      res.status(200).send(data)
    }).catch(err => {
      util.writeLog('delete Error', 'delete:/users/deleteUser/:id');
      var error = new Error();
      error.success = false;
      error.status = 404;
      error.message = 'User not found ';
      res.send(error);
    })
  } else {
    util.writeLog('delete Error', 'delete:/users/deleteUser/:id');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'User id not found ';
    res.send(error);
  }
})

router.get('/getAllUser', (req, res, next) => {
  const userLimit = req.body
  console.log(userLimit)
  var vUserModel = usermodel.retrieveAllUsers('users', '')
  vUserModel.then(function (data) {
    console.log(data.length)
    if (data.length > 0) {
      let result = {
        success: true,
        data: data
      }
      res.status(200).send(result);
    } else {
      let result = {
        success: false,
        data: ''
      }
      res.status(200).send(result);
    }
  }).catch(err => {
    console.log(err)
    util.writeLog('get Error', 'get:/users/getAllUser');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'Users not found ';
    res.send(error);
  })
});


router.post("/samplereactnativePost", (req, res) => {
  console.log(req.body)
  try {
    let useData = req.body
    let userStore = {
      title: useData.title,
      textareaValue: useData.textareaValue,
      CreatedAt: new Date(),
      userName: useData.userName,
      userId: ObjectID(useData.userId),
    };
  
    const vCreatePost = postmodel.createPost('posts', userStore)
    vCreatePost.then((data) => {
      console.log(data)
      res.status(200).send(data)
    }).catch(err => {
      util.writeLog('createUser Error', 'post:/users/createUser');
      var error = new Error();
      error.success = false;
      error.status = 404;
      error.message = 'Post not Created';
      res.send(error);
    })
  } catch (e) {
    console.log(err)
    util.writeLog('Post Error', 'post:/users/samplereactnativePost');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'Post not Created';
    res.send(error);
  }
})

router.post('/getAllPost',(req,res)=>{

  let useData = req.body
  let userStore = {
    userName: useData.userName,
    userId: ObjectID(useData.userId),
  };

  const vGetAllPost = postmodel.retrieveAllPost('posts', userStore)
  vGetAllPost.then((data) => {
    console.log(data)
    res.status(200).send(data)
  }).catch(err => {
    util.writeLog('createUser Error', 'post:/users/createUser');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'Post not Found';
    res.send(error);
  })
})


module.exports = router;

