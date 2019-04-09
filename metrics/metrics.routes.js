const express = require('express');

const metricsController = require('./metrics.controller');

let router = express.Router();

router.get('/countries', metricsController.getClickAverages);

module.exports = router;