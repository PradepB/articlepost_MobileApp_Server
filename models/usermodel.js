var ObjectID = require('mongodb').ObjectID;
/**
* User moel.
* @module User
*/
module.exports = {

    /**
      * @param {string} collectionName - Its contain collection name.
      * @param {Object} data - data contain to create user.
      * @return {Object} it return the success or failure of user creation
      */
    createUser: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find({ username: data.username }).toArray((err, res) => {
                if (err) { reject(err) }
                if (res.length == 0) {
                    db.collection(collectionName).insertOne(data, (err, dataval) => {
                        if (err) { reject(err) }
                        else {
                            let result = {
                                success: true,
                                status: 200,
                                message: "User created successful!"
                            }
                            resolve(result)
                        }
                    })
                } else {
                    const result = {
                        success: false,
                        status: 403,
                        message: "Email already added."
                    }
                    resolve(result)
                }
            })
        })
    },
    /**
  * @param {string} collectionName - Its contain collection name.
  * @param {Object} data - data contain to create user.
  * @param {string} id - id represent which user data want to update.
  * @return {Object} it return the success or failure of user updation
  */
    updateUser: (collectionName, data, id) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find({ _id: ObjectID(id) }).toArray((err, res) => {
                if (err) { reject(err) }
                if (res.length == 0) {
                    let result = {
                        success: false,
                        status: 403,
                        message: "User not found."
                    }
                    resolve(result)
                } else {
                    db.collection(collectionName).updateMany({ _id: ObjectID(id) }, {
                        $set: data
                    }, {
                        safe: true
                    }, (err, res) => {
                        if (err) { reject(err) }
                        else {
                            let result = {
                                success: true,
                                status: 200,
                                message: "Successfully Updated!"
                            }
                            resolve(result)


                        }

                    })
                }
            })
        })
    },
    /**
* @param {string} collectionName - Its contain collection name.
* @param {string} id - id represent which user data want to get.
* @return {Object} it return the specific user
*/
    getSingleUser: (collectionName, id) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find({ _id: ObjectID(id) }).toArray((err, res) => {
                if (err) { reject(err) }
                if (res.length == 0) {
                    let result = {
                        message: "User not found."
                    }
                    resolve(result)
                } else {
                    resolve(res)
                }
            })
        })
    },
    deleteUser: (collectionName, id) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find({ _id: ObjectID(id) }).toArray((err, res) => {
                if (err) { reject(err) }
                if (res.length == 0) {
                    let result = {
                        success: false,
                        status: 403,
                        message: "User not found."
                    }
                    resolve(result)
                } else {
                    db.collection(collectionName).deleteOne({ _id: ObjectID(id) }, (err, res) => {
                        if (err) {
                            reject(err)
                        }
                        else {

                            let result = {
                                success: true,
                                status: 200,
                                message: "User Deleted successfully!."
                            }
                            resolve(result)


                        }
                    })
                }
            })
        })
    },
    retrieveAllUsers: (collectionName, userLimit) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find().toArray((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res);
            });


        })
    },

    validateUser: function (collectionName, data) {
        return new Promise((resolve, reject) => {
            var db = global.db;
            var query = {
                username: data.username,
                password: data.password
            };
            console.log(collectionName)
            db.collection(collectionName).find(query).toArray(function (err, res) {
                if (err) {
                    reject(err)
                }
                else {
                    if (res.length == 0) {
                        let result = {
                            success: false,
                            status: 403,
                            message: "User not found.",
                            response:[]
                        }
                        resolve(result);
                    } else {

                        let result = {
                            success: true,
                            status: 200,
                            message: 'Login Success!',
                            response: res
                        }
                        resolve(result);
                    }
                }
            });
        })
    }
}