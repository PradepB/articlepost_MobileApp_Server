var ObjectID = require('mongodb').ObjectID;
/**
* User moel.
* @module User
*/
module.exports = {

    createPost: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => { 

                    db.collection(collectionName).insertOne(data, (err, dataval) => {
                        if (err) { reject(err) }
                        else {
                            let result = {
                                success: true,
                                status: 200,
                                message: "Post created successful!"
                            }
                            resolve(result)
                        }
                    })
        })
    },
    retrieveAllPost: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find().toArray((err, res) => {
                if (err) {
                    reject(err)
                }
                let result = {
                    success: true,
                    status: 200,
                    message: "Post Get successful!",
                    responseData:res
                }
                resolve(result);
            });


        })
    },
}