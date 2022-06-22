const express = require("express");
const router = express.Router();

const {
    getAllImages,
    imageUpload
} = require("../controllers/imageControllers");

router.post('image/getAllImages', getAllImages)
router.post('image/imageUpload', imageUpload)

module.exports = router;