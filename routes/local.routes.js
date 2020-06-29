const express = require('express');
const router  = express.Router();
const Property = require('../models/property.model');
const mongoose = require('mongoose');
const index_controller = require('../controllers/index.controllers');
const auth_controller = require('../controllers/auth.controllers');
const uploadCloud = require('../config/cloudinary.js');

router.get('/local/:id', index_controller.viewLocal);
router.post('/local/:id', index_controller.bookingDay);

router.get('/local/edit/:id', index_controller.editLocal);
router.post('/local/edit/:id', uploadCloud.single('main'), index_controller.saveLocal);
router.get('/local/love/:id', index_controller.loveLocal);
router.get('/owner/property/:id', index_controller.ownerViewLocal)


module.exports = router;