const Customer = require("../models/customer.model");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

//Mostrar el profile
exports.profile = (req, res, next) => {
    const sessionUser = req.session.currentUser || req.user;
    Customer.findById(sessionUser._id)
        .populate('ownProperties')
        .then((user) => {
            if (user.owner) {
                res.render("owner/profile", {
                    user,
                    title: "Mi perfil | KOKOMO",
                });
            } else {
                res.render("customer/profile", {
                    user,
                    title: "Mi perfil | KOKOMO",
                });
            }
        })
        .catch((error) => next(error));
};
//Formulario edición del profile
exports.profileEdit = (req, res, next) => {
    const sessionUser = req.session.currentUser || req.user;
    Customer.findById(sessionUser._id).then(user => {
        res.render('customer/edit', {
            user,
            title: 'Editar mi perfil | KOKOMO'
        });
    }).catch(error => next(error));
};
//Editar la contraseña
exports.profilePasswordChange = (req, res, next) => {
    const sessionUser = req.session.currentUser || req.user;
    const {
        id,
        oldPassword,
        newPassword
    } = req.body;
    if (bcrypt.compareSync(oldPassword, sessionUser.passwordHash)) {
        const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!regex.test(newPassword)) {
            res.status(500).render("auth/signup", {
                errorMessage: "La contraseña debe tener al menos 6 caracteres y debe contener, por lo menos, una letra minúscula, una mayúscula y un número.",
            });
            return;
        }
        bcrypt
        .genSalt(saltRounds)
        .then((salt) => bcrypt.hash(newPassword, salt))
        .then((hashedPassword) => {
          return Customer.findByIdAndUpdate(
            id,
            {passwordHash: hashedPassword},
            {
                new: true
            }
          ).then(resultado => {
            res.render('customer/edit', {
                user: sessionUser,
                title: 'Editar mi perfil | KOKOMO',
                infoMessage: '¡Contraseña cambiada! ✌️'
            });
        });
        }).catch(error => next(error));
    } else {
        res.render('customer/edit', {
            user: req.session.currentUser,
            title: 'Editar mi perfil | KOKOMO',
            errorMessage: 'Tu contraseña actual no es correcta'
        });
    }
};
//Editar el teléfono
exports.profileTelephoneChange = (req, res, next) => {
    const sessionUser = req.session.currentUser || req.user;
    const {
        id,
        newTelephone
    } = req.body;
    Customer.findByIdAndUpdate(id, {
            telNumber: newTelephone
        }, {
            new: true
        })
        .then(resultado => {
            res.render('customer/edit', {
                user: sessionUser,
                title: 'Editar mi perfil | KOKOMO',
                infoMessage: '¡Número de Teléfono cambiado! ✌️'
            });
        }).catch(error => next(error));
};
//Añadir etiqueta owner
exports.profileOwnerAdd = (req, res, next) => {
    const sessionUser = req.session.currentUser || req.user; 
    Customer.findByIdAndUpdate(sessionUser._id, {owner:true}, {
        new: true
      })
      .then(resultado => {
        res.render('owner/profile', {
          user: sessionUser,
          title: 'Editar mi perfil | KOKOMO',
          infoMessage: '¡Ya estás regustrado como propietario! ✌️'
        });
      }).catch(error => next(error));
  };
//Ver favoritos
exports.myFavourites = (req, res, next) => {
    const sessionUser = req.session.currentUser || req.user;
    Customer.findById(sessionUser._id).populate('favourites').then(user => {
      console.log(user.favourites);
      res.render('customer/favourites', {
        user,
        title: 'Mis favoritos | KOKOMO'
      });
    }).catch(error => next(error));
  };
//Borrar cuenta
exports.deleteAccount = (req, res, next) => {
    const sessionUser = req.session.currentUser || req.user;
    Customer.findByIdAndDelete(sessionUser)
      .then(user => {
        res.redirect('/');
      }).catch(error => next(error));
  };