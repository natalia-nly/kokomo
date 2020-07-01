const express = require('express');
const router  = express.Router();
const Property = require('../models/property.model');
const mongoose = require('mongoose');
const propertyController = require('../controllers/property.controllers');
const auth_controller = require('../controllers/auth.controllers');
const uploadCloud = require('../config/cloudinary.js');
const index_controller = require('../controllers/index.controllers');


//Creación de una propiedad
router.get('/property/create-property', propertyController.createProperty);
router.post('/property/create-property', uploadCloud.single('main'), propertyController.registerProperty);

//Ver detalles de una propiedad
router.get('/property/:id', propertyController.viewProperty);


router.get('/property/edit/:id', propertyController.editProperty);
router.post('/property/edit/:id', uploadCloud.single('main'), propertyController.saveProperty);
router.get('/property/love/:id', propertyController.loveProperty);
router.post('/add-comment/:id', index_controller.addComment);
router.get('/owner/property/:id', index_controller.ownerViewLocal);

router.get('/category/:name', index_controller.viewCategory);


module.exports = router;