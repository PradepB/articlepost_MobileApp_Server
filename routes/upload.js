var express = require('express');
var router = express.Router();
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file)
        console.log(file.mimetype)
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const vName = file.originalname.split('.')
        cb(null, file.originalname)
    }
})

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }

})
/**
 * 
 * @module uploadModule
 * @function
 * @param req {Object} The request.
 * @param res {Object} The response.
 * @param req.file {File} The file param.
 * @param {Function} next
 * @return {Object} returns genrated token
 */
router.post('/uploadfile', upload.single('File'), (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = {
            status: false
        }
      res.status(400).send(error);
    } else {
        file['status'] = true
        res.status(200).send(file);
    }

})
module.exports = router