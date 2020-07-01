const express = require('express');
const router  = express.Router();
const bookingController = require('../controllers/booking.controllers');

//Creación del booking
router.post('/booking/:id', bookingController.createBooking);
//Ver bookings
router.get("/my-bookings", bookingController.myBookings);
//Detalles del Booking
router.get('/booking/details/:id', bookingController.bookingDetails);
//Borrar bookings
router.get('/booking/delete/:id', bookingController.deleteBooking);

module.exports = router;