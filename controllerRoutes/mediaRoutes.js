const express = require("express");
const router = express.Router();

const {
    getAllImages,
    imageUpload,
    mediaDelete
} = require("../controllers/mediaControllers");

router.get('/getAllImages', getAllImages)
router.post('/imageUpload', imageUpload)
router.delete('/delete', mediaDelete)

module.exports = router;