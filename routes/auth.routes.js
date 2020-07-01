const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controllers");
const passport = require("passport");

//GET página de registro dónde el usario rellena su username y contraseña
router.get("/signup", authController.signUp);
//POST de los datos de signup, validación de los campos y redirección al perfil de usuario
router.post("/signup", authController.registerCustomer);
//GET Sign up para owners
router.get("/signup-local", authController.signUpLocal);
//POST Sign up para owners
router.post("/signup-local", authController.registerOwner);
//GET de la ruta login
router.get("/login", authController.loginView);
//POST de la ruta login
router.post("/login", authController.login);
// LOG OUT
router.get("/logout", authController.logout);
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