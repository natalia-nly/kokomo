const express = require('express');
const router  = express.Router();
const indexController = require('../controllers/index.controllers');

// GET home page
router.get('/', indexController.allProperties);

module.exports = router;
