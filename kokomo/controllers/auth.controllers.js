const Customer = require('../models/customer.model');
const bcrypt = require("bcryptjs");
const saltRounds = 10;


exports.signUp = (req, res, next) => res.render('auth/signup', { title: '¡Crea tu cuenta! | KOKOMO' });

exports.registerCustomer = (req, res, next) => {
    const {
        username,
        email,
        password
    } = req.body;
    if (!username || !email || !password) {
        res.render('auth/signup', {
            errorMessage: 'Necesitas completar todos los campos para crear tu cuenta'
        });
        return;
    }
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res.status(500).render('auth/signup', {
            errorMessage: 'La contraseña debe tener al menos 6 caracteres y debe contener, por lo menos, una letra minúscula, una mayúscula y un número.'
        });
        return;
    }
    bcrypt.genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hashedPassword => {
            return Customer.create({
                username,
                email,
                passwordHash: hashedPassword
            });
        }).then(userFromDB => {
            console.log('Customer creado: ', userFromDB.username);
            req.session.currentUser = userFromDB;
            console.log(userFromDB);
            res.redirect('/');
        })
        .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(400).render('auth/signup', {
                    errorMessage: error.message
                });
            } else if (error.code === 11000) {
                res.status(400).render('auth/signup', {
                    errorMessage: 'El username ya existe...'
                });
            } else {
                next(error);
            }
        });
};

exports.loginView = (req, res, next) => res.render('auth/login', { title: 'Inicia sesión | KOKOMO' });

exports.login = (req, res, next) => {
    const { email, password } = req.body;
    if (email === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, email and password to login.'
      });
      return;
    }
  
    Customer.findOne({ email })
      .then(user => {
        if (!user) {
          res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
          return;
        } else if (bcrypt.compareSync(password, user.passwordHash)) {
          req.session.currentUser = user;
          res.redirect('/');
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
};

exports.profile = (req, res) => {
    console.log("Sesión: ", req.session);
    res.render('customer/profile', {user: req.session.currentUser});
};