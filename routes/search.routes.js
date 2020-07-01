const express = require('express');
const router  = express.Router();
const Property = require('../models/property.model');
const mongoose = require('mongoose');
const searchController = require('../controllers/search.controllers');
const uploadCloud = require('../config/cloudinary.js');



//Búsqueda de resultados
router.get('/search', searchController.newSearch);
router.post('/search', searchController.searchResults);
//Consulta de disponibilidad en un Local
router.post('/local/:id', searchController.bookingDay);


module.exports = router;