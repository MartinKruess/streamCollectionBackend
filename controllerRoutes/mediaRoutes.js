const express = require("express");
const router = express.Router();

const {
    getAllImages,
    imageUpload
} = require("../controllers/mediaControllers");

router.get('/getAllImages', getAllImages)
router.post('/imageUpload', imageUpload)

module.exports = router;