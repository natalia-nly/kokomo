const express = require('express');
const router  = express.Router();
const propertyController = require('../controllers/property.controllers');
const uploadCloud = require('../config/cloudinary.js');

//Creación de un local
router.get('/property/create-property', propertyController.createProperty);
router.post('/property/create-property', uploadCloud.single('main'), propertyController.registerProperty);
//Ver detalles de un local
router.get('/property/:id', propertyController.viewProperty);
//Edición de un local
router.get('/property/edit/:id', propertyController.editProperty);
router.post('/property/edit/:id', uploadCloud.single('main'), propertyController.saveProperty);
//Añadir a favoritos un local
router.get('/property/love/:id', propertyController.loveProperty);
//Añadir comentarios a un local
router.post('/property/add-comment/:id', propertyController.addComment);
//router.get('/owner/property/:id', index_controller.ownerViewLocal);

module.exports = router;