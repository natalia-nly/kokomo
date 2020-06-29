const express = require('express');
const router  = express.Router();
const Property = require('../models/property.model');
const mongoose = require('mongoose');
const index_controller = require('../controllers/index.controllers');
const auth_controller = require('../controllers/auth.controllers');
const uploadCloud = require('../config/cloudinary.js');

router.post('/booking/:id', index_controller.createBooking);

router.get("/my-bookings", auth_controller.myBookings);

router.get('/booking/delete/:id', index_controller.deleteBooking);

router.get('/booking/details/:id', index_controller.bookingDetails);

module.exports = router;