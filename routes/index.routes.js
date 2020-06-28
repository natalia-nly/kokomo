const express = require('express');
const router  = express.Router();
const Property = require('../models/property.model');
const mongoose = require('mongoose');
const index_controller = require('../controllers/index.controllers');
const uploadCloud = require('../config/cloudinary.js');

// GET home page
router.get('/', index_controller.allProperties);

router.get('/local/:id', index_controller.viewLocal);

router.post('/local/:id', index_controller.bookingDay);

router.post('/booking/:id', index_controller.createBooking);

router.get('/booking/delete/:bookingRef', index_controller.deleteBooking);

router.get('/profile/create-local', index_controller.createLocal);

router.post('/profile/create-local', uploadCloud.single('main'), index_controller.registerLocal);

router.get('/owner/property/:id', index_controller.ownerViewLocal);

router.get('/local/edit/:id', index_controller.editLocal);
router.post('/local/edit/:id', uploadCloud.single('main'), index_controller.saveLocal);

router.get('/local/love/:id', index_controller.loveLocal);


module.exports = router;
