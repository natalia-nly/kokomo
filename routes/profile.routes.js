const express = require('express');
const router  = express.Router();
const Property = require('../models/property.model');
const mongoose = require('mongoose');
const index_controller = require('../controllers/index.controllers');
const auth_controller = require('../controllers/auth.controllers');
const uploadCloud = require('../config/cloudinary.js');

router.get('/profile/create-local', index_controller.createLocal);
router.post('/profile/create-local', uploadCloud.single('main'), index_controller.registerLocal);

// GET de la ruta profile del customer
router.get("/profile", auth_controller.profile);

// Rutas del profile
router.get("/profile/edit", auth_controller.profileEdit);
router.post("/profile/editPassword", auth_controller.profilePasswordChange);
router.post("/profile/editTelephone", auth_controller.profileTelephoneChange);
router.get("/profile/delete", auth_controller.deleteAccount);
router.get("/my-favourites", auth_controller.myFavourites);

//Añadir owner
router.post("/profile/add-owner", auth_controller.profileOwnerAdd);

module.exports = router;