const express = require('express');
const router  = express.Router();
const searchController = require('../controllers/search.controllers');

//Búsqueda de resultados
router.get('/search', searchController.newSearch);
router.post('/search', searchController.searchResults);
//Consulta de disponibilidad en un Local
router.post('/property/:id', searchController.bookingDay);
//Consulta de locales por Categoría
router.get('/category/:name', searchController.viewCategory);

module.exports = router;