var express = require('express');

var app = express();

const crypto = require("crypto").randomBytes(256).toString('hex')
const mongoose = require('mongoose');
var db;
var initialized = false;



function initialize(database, host,callback) {

    // console.log(req)
    if (initialized) {
        return callback();
    }
    initialized = true;
    openMongo(callback,host);
}
function openMongo(callback,host) {

    // var url=    'mongodb://localhost:27017/demoApp'
    console.log(process.env.DB)
    // var url = 'mongodb://' + process.env.DB_Address + ':' + process.env.DB_PORT + '/' + process.env.DB;
    var url ='mongodb://ebasicstest:ebasicstest@ebasics-test-shard-00-00-dnrmf.mongodb.net:27017,ebasics-test-shard-00-01-dnrmf.mongodb.net:27017,ebasics-test-shard-00-02-dnrmf.mongodb.net:27017/articlepost?ssl=true&replicaSet=eBasics-test-shard-0&authSource=admin'
    console.log(url)
    mongoose.connect(url, {
        useCreateIndex: true, useNewUrlParser: true,useUnifiedTopology: true
    }, (err, client) => {
        if (err) {
            console.log("connection refused")
        } else {
            db = client.db//(process.env.DB);
        
            global.db = db;
            global.clients={}
            global.clientdbconn={}
            console.log("database connected")
        }
    })
}

module.exports.initialize = initialize;
module.exports.openMongo = openMongo;