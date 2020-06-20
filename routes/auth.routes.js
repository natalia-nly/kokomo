const express = require('express');
const router  = express.Router();
const Property = require('../models/property.model');
const mongoose = require('mongoose');
const auth_controller = require('../controllers/auth.controllers');

//GET página de registro dónde el usario rellena su username y contraseña
router.get('/signup', auth_controller.signUp);

//POST de los datos de signup, validación de los campos y redirección al perfil de usuario
router.post('/signup', auth_controller.registerCustomer);

// GET de la ruta login
router.get('/login', auth_controller.loginView);

// POST de la ruta login
router.post('/login', auth_controller.login);

// GET de la ruta profile del customer
router.get('/profile', auth_controller.profile);

// Rutas del profile
router.get('/profile/edit', auth_controller.profileEdit);
router.post('/profile/editPassword', auth_controller.profilePasswordChange);
router.post('/profile/editTelephone', auth_controller.profileTelephoneChange);
router.get('/profile/delete', auth_controller.deleteAccount);

//Sign up para owners
router.get('/signup-local', auth_controller.signUpLocal);
router.post('/signup-local', auth_controller.registerOwner);

// LOG OUT
router.get('/logout', auth_controller.logout);

module.exports = router;
