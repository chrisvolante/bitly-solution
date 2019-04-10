const express = require('express');

const metricsController = require('./metrics.controller');

let router = express.Router();

// router.get('/countries', metricsController.getClickAverages);

router.get('/countries', (req, res) => metricsController.getClickAverages(req, res)
  .catch(err => {
    console.error(err)
    res.sendStatus(500)
  })
);

module.exports = router;