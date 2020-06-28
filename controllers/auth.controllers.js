const Customer = require("../models/customer.model");
const Property = require("../models/property.model");
const Booking = require("../models/booking.model");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

exports.signUp = (req, res, next) =>
  res.render("auth/signup", {
    title: "¡Crea tu cuenta! | KOKOMO",
    layout: "layout-nouser",
  });

exports.signUpLocal = (req, res, next) =>
  res.render("auth/signup-owner", {
    title: "¡Crea tu cuenta! | KOKOMO",
    layout: "layout-nouser",
  });

exports.registerCustomer = (req, res, next) => {
  const { username, telephone, email, password } = req.body;
  if (!username || !telephone || !email || !password) {
    res.render("auth/signup", {
      errorMessage: "Necesitas completar todos los campos para crear tu cuenta",
    });
    return;
  }
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "La contraseña debe tener al menos 6 caracteres y debe contener, por lo menos, una letra minúscula, una mayúscula y un número.",
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
        telephone,
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

exports.registerOwner = (req, res, next) => {
  const { username, telephone, email, password } = req.body;
  if (!username || !telephone || !email || !password) {
    res.render("auth/signup", {
      errorMessage: "Necesitas completar todos los campos para crear tu cuenta",
    });
    return;
  }
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "La contraseña debe tener al menos 6 caracteres y debe contener, por lo menos, una letra minúscula, una mayúscula y un número.",
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
        telephone,
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

exports.loginView = (req, res, next) =>
  res.render("auth/login", {
    title: "Inicia sesión | KOKOMO",
    layout: "layout-nouser",
  });

exports.login = (req, res, next) => {
    const sessionUser =req.session.currentUser|| req.user;
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
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password.",
        });
      }
    
};

exports.profile = (req, res, next) => {
  const sessionUser = req.session.currentUser || req.user;

  Customer.findById(sessionUser._id)
    .populate('ownProperties')
    .then((user) => {
      if (user.owner) {
        console.log(user)
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

exports.myFavourites = (req, res, next) => {
    const sessionUser =req.session.currentUser|| req.user;
    Customer.findById(sessionUser._id).populate('favourites').then(user => {
        console.log(user.favourites);
        res.render('customer/favourites', {
            user,
            title: 'Mis favoritos | KOKOMO'
        });
    }).catch(error => next(error));
};

// exports.myBookings = (req, res, next) => {
//     const sessionUser =req.session.currentUser|| req.user;
//     // BOOKINGS DEL OWNER
//     if (sessionUser.owner) {
//         Customer.findById(sessionUser._id).populate({
//             path: 'ownProperties',
//             populate: { path: 'bookings' }
//           })
//         .then(user => {
//             console.log("USER CON DEEP POPULATE: ", user);
//             console.log(user.ownProperties[0].bookings)
//             res.render('owner/bookings', {
//                 user,
//                 title: 'Mis reservas | KOKOMO'
//             });

//             /*const getProperties = async () => {
//                 return Promise.all(user.ownProperties.map(async (property) => {
//                     var local = await Property.findById(property.id);
//                     return local;

//                 }))
//             }

//             getProperties().then(properties => {

//                 const propertiesBookings = async () => {
//                     return Promise.all(properties.map(property => {
//                         const getBookings = async () => {
//                             return Promise.all(property.bookings.map(async (booking) => {
//                                 var item = await Booking.findById(booking.bookingId);
//                                 return item;
//                             }))
//                         };
//                         getBookings().then(bookings => {
//                             console.log(bookings)
//                             res.render('owner/bookings', {
//                                 user,
//                                 title: 'Mis reservas | KOKOMO',
//                                 bookings
//                             });
//                         })

//                     }))
//                 }
//                 propertiesBookings()
                
                
//             })*/
//       }).catch(error => next(error));
//     } 
//     // BOOKINGS DEL CUSTOMER
//     else {
//         Customer.findById(sessionUser._id).populate('bookings').then(user => {
//             console.log(user)
//             res.render('customer/bookings', {
//                 user,
//                 title: 'Mis reservas | KOKOMO'
//             });
//         }).catch(error => next(error));
//     }

//     getProperties()
//     .then((properties) => {
//           const propertiesBookings = async () => {
//             return Promise.all(
//               properties.map((property) => {
//                 const getBookings = async () => {
//                   return Promise.all(
//                     property.bookings.map(async (booking) => {
//                       var item = await Booking.findById(booking.bookingId);
//                       return item;
//                     })
//                   );
//                 };
//                 getBookings()
//                 .then((bookings) => {
//                   console.log(bookings);
//                   res.render("owner/bookings", {
//                     user,
//                     title: "Mis reservas | KOKOMO",
//                     bookings,
//                   });
//                 })
//                 .catch((error) => next(error));
//               })
//             );
//           };
//           propertiesBookings();
//         })
    
  
//     Customer.findById(req.session.currentUser._id)
//       .then((user) => {
//         res.render("customer/bookings", {
//           user,
//           title: "Mis reservas | KOKOMO",
//         });
//       })
//       .catch((error) => next(error))
  
//   };

  exports.myBookings = (req, res, next) => {
    const sessionUser =req.session.currentUser|| req.user;
    // BOOKINGS DEL OWNER
    if (sessionUser.owner) {
        Customer.findById(sessionUser._id).populate({
            path: 'ownProperties',
            populate: { path: 'bookings' }
          })
        .then(user => {
            console.log("USER CON DEEP POPULATE: ", user);
            console.log(user.ownProperties[0].bookings)
            res.render('owner/bookings', {
                user,
                title: 'Mis reservas | KOKOMO'
            });

            /*const getProperties = async () => {
                return Promise.all(user.ownProperties.map(async (property) => {
                    var local = await Property.findById(property.id);
                    return local;
                }))
            }
            getProperties().then(properties => {
                const propertiesBookings = async () => {
                    return Promise.all(properties.map(property => {
                        const getBookings = async () => {
                            return Promise.all(property.bookings.map(async (booking) => {
                                var item = await Booking.findById(booking.bookingId);
                                return item;
                            }))
                        };
                        getBookings().then(bookings => {
                            console.log(bookings)
                            res.render('owner/bookings', {
                                user,
                                title: 'Mis reservas | KOKOMO',
                                bookings
                            });
                        })
                    }))
                }
                propertiesBookings()
                
                
            })*/
      }).catch(error => next(error));
    } 
    // BOOKINGS DEL CUSTOMER
    else {
        Customer.findById(sessionUser._id).populate('bookings').then(user => {
            console.log(user)
            res.render('customer/bookings', {
                user,
                title: 'Mis reservas | KOKOMO'
            });
        }).catch(error => next(error));
    }

        getProperties().then((properties) => {
          const propertiesBookings = async () => {
            return Promise.all(
              properties.map((property) => {
                const getBookings = async () => {
                  return Promise.all(
                    property.bookings.map(async (booking) => {
                      var item = await Booking.findById(booking.bookingId);
                      return item;
                    })
                  );
                };
                getBookings().then((bookings) => {
                  console.log(bookings);
                  res.render("owner/bookings", {
                    user,
                    title: "Mis reservas | KOKOMO",
                    bookings,
                  });
                });
              })
            );
          };
          propertiesBookings();
        });
      })
      .catch((error) => next(error));
  } else {
    Customer.findById(req.session.currentUser._id)
      .then((user) => {
        res.render("customer/bookings", {
          user,
          title: "Mis reservas | KOKOMO",
        });
      })
      .catch((error) => next(error));
  }
};


exports.profileEdit = (req, res, next) => {
    const sessionUser =req.session.currentUser|| req.user;
    Customer.findById(sessionUser._id).then(user => {
        res.render('customer/edit', {
            user,
            title: 'Editar mi perfil | KOKOMO'
        });
    }).catch(error => next(error));

};

exports.profileTelephoneChange = (req, res, next) => {
    const sessionUser =req.session.currentUser|| req.user;
    const {
        id,
        newTelephone
    } = req.body;
    Customer.findByIdAndUpdate(id, newTelephone, {
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

exports.profilePasswordChange = (req, res, next) => {
    const {
        id,
        oldPassword,
        newPassword
    } = req.body;
    if (bcrypt.compareSync(oldPassword, req.session.currentUser.passwordHash)) {
        Customer.findByIdAndUpdate(id, newPassword, {
                new: true
            })
            .then(resultado => {
                res.render('customer/edit', {
                    user: req.session.currentUser,
                    title: 'Editar mi perfil | KOKOMO',
                    infoMessage: '¡Contraseña cambiada! ✌️'
                });
            }).catch(error => next(error));
    } else {
        res.render('customer/edit', {
            user: req.session.currentUser,
            title: 'Editar mi perfil | KOKOMO',
            errorMessage: 'Tu contraseña actual no es correcta'
        });
      })
      .catch((error) => next(error));
  } else {
    res.render("customer/edit", {
      user: req.session.currentUser,
      title: "Editar mi perfil | KOKOMO",
      errorMessage: "Tu contraseña actual no es correcta",
    });
  }
};

exports.deleteAccount = (req, res, next) => {
    const sessionUser =req.session.currentUser|| req.user;
    Customer.findByIdAndDelete(sessionUser)
        .then(user => {
            res.redirect('/');
        }).catch(error => next(error));
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};
