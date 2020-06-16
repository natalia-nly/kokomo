const express = require('express');
const router  = express.Router();
const Property = require('../models/property.model');
const mongoose = require('mongoose');
const index_controller = require('../controllers/index.controllers');

// GET home page
router.get('/', index_controller.allProperties);

router.get('/local/:id', index_controller.viewLocal);

module.exports = router;
