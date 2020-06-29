const express = require("express");
const router = express.Router();
const Property = require("../models/property.model");
const mongoose = require("mongoose");
const auth_controller = require("../controllers/auth.controllers");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

//GET página de registro dónde el usario rellena su username y contraseña
router.get("/signup", auth_controller.signUp);

//POST de los datos de signup, validación de los campos y redirección al perfil de usuario
router.post("/signup", auth_controller.registerCustomer);

// GET de la ruta login
router.get("/login", auth_controller.loginView);

// POST de la ruta login
router.post("/login", auth_controller.login);




//Sign up para owners
router.get("/signup-local", auth_controller.signUpLocal);
router.post("/signup-local", auth_controller.registerOwner);



// LOG OUT
router.get("/logout", auth_controller.logout);

// LOGIN SOCIAL
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/profile",
    failureRedirect: "/", // hacia dónde debe ir si falla?
  })
);

module.exports = router;
