const Customer = require("../models/customer.model");
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const saltRounds = 10;

//Acceder al form de SignUp
exports.signUp = (req, res, next) =>
  res.render("auth/signup", {
    title: "¡Crea tu cuenta! | KOKOMO",
    layout: "layout-nouser",
  });
//Acceder al form de SignUp de local
exports.signUpLocal = (req, res, next) =>
  res.render("auth/signup-owner", {
    title: "¡Crea tu cuenta! | KOKOMO",
    layout: "layout-nouser",
  });
//Creación de Avatar Random
const randomAvatar = () => {
  const avatarArr = [
    '/images/avatar1.jpg',
    '/images/avatar2.jpg',
    '/images/avatar3.jpg',
    '/images/avatar4.jpg',
    '/images/avatar5.jpg'
  ];
  return avatarArr[Math.floor(Math.random() * 5)];
};
//Registrar el customer en BBDD
exports.registerCustomer = (req, res, next) => {
  const {
    username,
    telephone,
    email,
    password
  } = req.body;
  if (!username || !telephone || !email || !password) {
    res.render("auth/signup", {
      errorMessage: "Necesitas completar todos los campos para crear tu cuenta",
    });
    return;
  }
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage: "La contraseña debe tener al menos 6 caracteres y debe contener, por lo menos, una letra minúscula, una mayúscula y un número.",
    });
    return;
  }
  const regexEmail = /\S+@\S+\.\S+/;
  if (!regexEmail.test(email)) {
    res.status(500).render("auth/signup", {
      errorMessage: "Por favor, pon una dirección de correo válida",
    });
    return;
  }
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      return Customer.create({
        username,
        email,
        telNumber: telephone,
        avatar: randomAvatar(),
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log("Customer creado: ", userFromDB.username);
      req.session.currentUser = userFromDB;
      console.log(userFromDB);
      res.redirect("/");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).render("auth/signup", {
          errorMessage: error.message,
        });
      } else if (error.code === 11000) {
        res.status(400).render("auth/signup", {
          errorMessage: "El username ya existe...",
        });
      } else {
        next(error);
      }
    });
};
//Registrar el customer como Owner
exports.registerOwner = (req, res, next) => {
  const {
    username,
    telephone,
    email,
    password
  } = req.body;
  if (!username || !telephone || !email || !password) {
    res.render("auth/signup", {
      errorMessage: "Necesitas completar todos los campos para crear tu cuenta",
    });
    return;
  }
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage: "La contraseña debe tener al menos 6 caracteres y debe contener, por lo menos, una letra minúscula, una mayúscula y un número.",
    });
    return;
  }
  const regexEmail = /\S+@\S+\.\S+/;
  if (!regexEmail.test(email)) {
    res.status(500).render("auth/signup", {
      errorMessage: "Por favor, pon una dirección de correo válida",
    });
    return;
  }
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      return Customer.create({
        username,
        email,
        telNumber: telephone,
        avatar: randomAvatar(),
        passwordHash: hashedPassword,
        owner: true,
      });
    })
    .then((userFromDB) => {
      console.log("Customer creado: ", userFromDB.username);
      req.session.currentUser = userFromDB;
      console.log(userFromDB);
      res.redirect("/");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).render("auth/signup", {
          errorMessage: error.message,
        });
      } else if (error.code === 11000) {
        res.status(400).render("auth/signup", {
          errorMessage: "El username ya existe...",
        });
      } else {
        next(error);
      }
    });
};
//Página de Login form
exports.loginView = (req, res, next) =>
  res.render("auth/login", {
    title: "Inicia sesión | KOKOMO",
    layout: "layout-nouser",
  });

//Logearse
exports.login = (req, res, next) => {
  const sessionUser = req.session.currentUser || req.user;
  if (sessionUser) {
    return res.redirect('/profile');
  }
  const {
    email,
    password
  } = req.body;
  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }
  Customer.findOne({
      email
    })
    .then(user => {
      if (!user) {
        res.render('auth/login', {
          errorMessage: 'Email is not registered. Try with other email.'
        });
        return;
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect('/');

      } else {
        res.render('auth/login', {
          errorMessage: 'Incorrect password.'
        });
      }
    })
    .catch(error => next(error));
};
//LogOut
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};