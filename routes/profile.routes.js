const express = require('express');
const router  = express.Router();
const profileController = require('../controllers/profile.controllers');

// GET de la ruta profile del customer
router.get("/profile", profileController.profile);
//Editar el profile
router.get("/profile/edit", profileController.profileEdit);
//Editar la contraseña
router.post("/profile/editPassword", profileController.profilePasswordChange);
//Editar el teléfono
router.post("/profile/editTelephone", profileController.profileTelephoneChange);
//Añadir owner
router.post("/profile/add-owner", profileController.profileOwnerAdd);
//Ver los favoritos
router.get("/my-favourites", profileController.myFavourites);
//Borrar cuenta
router.get("/profile/delete", profileController.deleteAccount);

module.exports = router;