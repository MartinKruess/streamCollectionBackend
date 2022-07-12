const express = require("express");
const router = express.Router();

const {
    getDashboardTwitchData,
} = require("../controllers/dashboardControllers");

router.get('/getDashboardTwitchData', getDashboardTwitchData)

module.exports = router;