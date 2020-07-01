const express = require('express');
const router  = express.Router();
const Property = require('../models/property.model');
const mongoose = require('mongoose');
const index_controller = require('../controllers/index.controllers');
const auth_controller = require('../controllers/auth.controllers');
const bookingController = require('../controllers/booking.controllers');
const uploadCloud = require('../config/cloudinary.js');


//Creación del booking
router.post('/booking/:id', bookingController.createBooking);
//Ver bookings
router.get("/my-bookings", bookingController.myBookings);
//Borrar bookings
router.get('/booking/delete/:id', index_controller.deleteBooking);
//Detalles del Booking
router.get('/booking/details/:id', bookingController.bookingDetails);



module.exports = router;