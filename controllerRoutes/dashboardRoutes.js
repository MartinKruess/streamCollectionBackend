const express = require("express");
const router = express.Router();

const {
    getDashboardTwitchData,
    banTwitchUser,
} = require("../controllers/dashboardControllers");

// GET
router.get('/getDashboardTwitchData', getDashboardTwitchData)

// POSTS
router.post('/banTwitchUser', banTwitchUser)

// PUT

// DELETE

module.exports = router;