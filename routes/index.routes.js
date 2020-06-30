const express = require('express');
const router  = express.Router();
const Property = require('../models/property.model');
const mongoose = require('mongoose');
const index_controller = require('../controllers/index.controllers');
const uploadCloud = require('../config/cloudinary.js');

// GET home page
router.get('/', index_controller.allProperties);

module.exports = router;
