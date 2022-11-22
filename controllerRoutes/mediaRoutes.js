const express = require("express");
const router = express.Router();

const {
    getAllMedia,
    imageUpload,
    mediaDelete
} = require("../controllers/mediaControllers");

router.get('/getAllImages', getAllMedia)
router.post('/imageUpload', imageUpload)
router.delete('/delete', mediaDelete)

module.exports = router;