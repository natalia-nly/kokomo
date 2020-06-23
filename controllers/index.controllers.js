const Property = require('../models/property.model');
const Schedule = require('../models/schedule.model');
const Booking = require('../models/booking.model');
const Customer = require('../models/customer.model');

exports.createLocal = (req, res, next) => res.render('owner/create-local', {
  title: 'Crea tu local | KOKOMO',
  layout: 'layout',
  user: req.session.currentUser
});


function createSchedule(property) {
  const timeRanges = property.openingHours;
  const bookTime = property.bookingDuration;
  var scheduleObject = {
    property: property._id,
    timeBoxes: []
  };
  let newSchedule;
  timeRanges.forEach(timeRange => {
    const openDays = (timeRange.openingDays.closingDay.getTime() - timeRange.openingDays.openingDay.getTime()) / (1000 * 3600 * 24);
    const weekDays = timeRange.weekDays;
    var currentDay = timeRange.openingDays.openingDay;

    for (let i = 0; i < openDays; i++) {
      if (weekDays.includes(currentDay.getDay())) {
        timeRange.openingTimes.forEach(opening => {
          var interval = bookTime / 60;
          let hours = opening.closingTime - opening.openingTime;
          let total = hours / interval;
          let t = opening.openingTime;
          let rest = 0;
          let startTime = t + rest;
          var timeBox = {
            day: currentDay,
            startTime: startTime,
            status: true,
            remaining: property.availablePlaces,
            total: property.availablePlaces
          }
          for (let j = 0; j < total; j++) {
            t = t + (bookTime / 100);

            if ((t - Math.floor(t)) >= 0.60) {
              let rest = (t - Math.floor(t)) - 0.60;
              t = Math.floor(t) + rest + 1;

            }

            timeBox = {
              day: new Date(currentDay),
              startTime: startTime.toFixed(2).replace(".", ":"),
              status: true,
              remaining: property.availablePlaces,
              total: property.availablePlaces
            };
            console.log("TimBox:" + timeBox)
            scheduleObject.timeBoxes.push(timeBox)
            startTime = t + rest;

          }
        })
        console.log(scheduleObject)
        newSchedule = JSON.parse(JSON.stringify(scheduleObject));

        currentDay.setDate(currentDay.getDate() + 1);

      } else {
        currentDay.setDate(currentDay.getDate() + 1);
      }
    }
  });
  Schedule.create(newSchedule, err => {
    if (err) {
      throw err;
    }
    console.log(`Created ${scheduleObject.property} schedules`);
  });
}

exports.registerLocal = (req, res, next) => {
  console.log(req.body);
  const workingDays = [];
  if (req.body.monday) {
    workingDays.push(req.body.monday);
  }
  if (req.body.tuesday) {
    workingDays.push(req.body.tuesday);
  }
  if (req.body.wednesday) {
    workingDays.push(req.body.wednesday);
  }
  if (req.body.thursday) {
    workingDays.push(req.body.thursday);
  }
  if (req.body.friday) {
    workingDays.push(req.body.friday);
  }
  if (req.body.satuday) {
    workingDays.push(req.body.saturday);
  }
  if (req.body.sunday) {
    workingDays.push(req.body.sunday);
  }

  Property.create({
    owner: req.session.currentUser,
    name: req.body.name,
    description: req.body.description,
    categories: [req.body.categories],
    mainImage: req.body.main,
    media: [req.body.media],
    location: {
      name: req.body.ubication,
      lat: req.body.latitude,
      long: req.body.longitude
    },
    openingHours: [{
       openingDays: {
         openingDay: req.body.opening,
         closingDay: req.body.closing
      },
     weekDays: workingDays,
      openingTimes: [{
        openingTime: req.body.openhour,
        closingTime: req.body.closehour
      }]
    }],
    bookingDuration: req.body.duration,
    availablePlaces: req.body.places,
  }).then(property => {
    createSchedule(property);
    const ownerLocal = {
      id: property._id,
      name: property.name,
      mainImage: property.mainImage
    }
    Customer.findByIdAndUpdate(req.session.currentUser._id, {
      $push: {
        ownProperties: ownerLocal
      }
    }, {
      new: true
    }).then(customer => console.log(customer)).catch(error => {
      console.log('Error: ', error);
    });
    res.render('property/property-details', {
      title: 'Local creado | KOKOMO',
      layout: 'layout',
      user: req.session.currentUser,
      property
    });
  })

};


exports.allProperties = (req, res, next) => {

  Property.find()
    .then(allProp => {
      if (req.session.currentUser) {
        res.render('index', {
          properties: allProp,
          title: 'KOKOMO | ¡Haz tu reserva!',
          user: req.session.currentUser
        });
      } else {
        res.render('landing-page', {
          properties: allProp,
          title: 'KOKOMO | ¡Haz tu reserva!',
          layout: 'layout-nouser'
        });
      }

    })
    .catch(error => {
      console.log('Error while getting the properties from the DB: ', error);
    });

};

exports.viewLocal = (req, res, next) => {
  Property.findById(req.params.id)
    .then(resultado => {
      res.render("property/property-details", {
        property: resultado,
        title: `${resultado.name} | KOKOMO`,
        user: req.session.currentUser
      });
    })
    .catch(error => {
      console.log('Error: ', error);
    });

};

exports.ownerViewLocal = (req, res, next) => {
  Property.findById(req.params.id)
    .then(resultado => {
      res.render("owner/property-details", {
        property: resultado,
        title: `${resultado.name} | KOKOMO`,
        user: req.session.currentUser
      });
    })
    .catch(error => {
      console.log('Error: ', error);
    });

};

exports.editLocal = (req, res, next) => {
  Property.findById(req.params.id)
    .then(resultado => {
      res.render("owner/edit-local", {
        property: resultado,
        title: `Editar ${resultado.name} | KOKOMO`,
        user: req.session.currentUser
      });
    })
    .catch(error => {
      console.log('Error: ', error);
    });

};

exports.loveLocal = (req, res, next) => {
  Property.findById(req.params.id)
    .then(resultado => {
      const newFavourite = {
        _id: resultado._id,
        name: resultado.name,
        mainImage: resultado.mainImage,
        location: resultado.location.name
      };

      Customer.findOneAndUpdate(
        {_id: req.session.currentUser._id}, 
        {$push: {favourites: newFavourite}
      })
      .then(customer => {
        console.log("Usuario actualizado", customer);
        res.redirect('back');
      })
      .catch(error => {
        console.log('Error: ', error);
      });

    })
    .catch(error => {
      console.log('Error: ', error);
    });

};

exports.bookingDay = (req, res, next) => {
  const propertyId = req.params.id;
  let bookingDate = req.body.bookingDate;
  let newDate = new Date(bookingDate);
  let newGuests = req.body.numberGuests;
  console.log(newGuests);

  const p1 = Property.findById(req.params.id);
  const p2 = Schedule.find({
    property: {
      $eq: propertyId
    }
  });

  Promise.all([p1, p2])
    .then(resultados => {
      const theProperty = resultados[0];
      const schedules = resultados[1];
      const allSchedules = schedules[0].timeBoxes;
      const finalSchedules = allSchedules.filter(element => element.day.getTime() == newDate.getTime() && element.remaining >= newGuests);

      res.render("property/booking-options", {
        property: theProperty,
        schedule: finalSchedules,
        newDate: bookingDate,
        newGuests: newGuests,
        guests: newGuests,
        user: req.session.currentUser,
        title: `${theProperty.name} | KOKOMO`,
      });
    })
    .catch(error => {
      console.log('Error: ', error);
    });
};

function uniqueId(stringLength, possible) {
  stringLength = 5;
  possible = "ABCDEFGHJKMNPQRSTUXY12345";
  var text = "";

  for (var i = 0; i < stringLength; i++) {
    var character = getCharacter(possible);
    while (text.length > 0 && character === text.substr(-1)) {
      character = getCharacter(possible);
    }
    text += character;
  }

  return text;
}

function getCharacter(possible) {
  return possible.charAt(Math.floor(Math.random() * possible.length));
}

function formattedDate(d) {
  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  const year = String(d.getFullYear());
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return `${day}/${month}/${year}`;
}

exports.createBooking = (req, res, next) => {

  console.log("Schedule ID: ", req.params.id);
  console.log("Body: ", req.body);

  let {
    day,
    propertyId,
    guests
  } = req.body;

  ////////////////////////////////////

  Schedule.find({
      "timeBoxes._id": {
        $eq: req.params.id
      }
    })
    .then(([{
      timeBoxes
    }]) => {
      //Filtrar el timebox seleccionado
      const [finalTimebox] = timeBoxes.filter(element => element._id == req.params.id);
      const [{
        startTime
      }] = timeBoxes.filter(element => element._id == req.params.id);
      const bookingRef = uniqueId();
      day = formattedDate(new Date(day));
      const remainingUpdate = finalTimebox.remaining - guests;


      Schedule.updateOne({
        property: propertyId,
        "timeBoxes._id": req.params.id
      }, {
        $set: {
          "timeBoxes.$.remaining": remainingUpdate
        }
      }).then(finalbox => console.log(finalbox));


      //Crear la reserva en la colección de bookings
      return Booking.create({
        customer: req.session.currentUser._id,
        customerName: req.session.currentUser.username,
        telNumber: req.session.currentUser.telNumber,
        property: propertyId,
        day: day,
        bookingRef: bookingRef,
        time: finalTimebox.startTime,
        guests: guests
      });

    })
    .then(booking => {
      //console.log("Customer: ",req.session.currentUser._id);
      console.log("Reserva creada: ", booking);
      res.render('property/booking-details', {
        booking: booking,
        user: req.session.currentUser,
        title: `Reserva creada | KOKOMO`,
      });

      // Actualizar el perfil del cliente 
      // Buscando la property para coger el nombre del local
      Property.findById(booking.property).then(property => {
          const bookingCliente = {
            bookingId: booking._id,
            bookingRef: booking.bookingRef,
            guests: booking.guests,
            property: property.name,
            day: booking.day,
            time: booking.time
          };
          // Actualizar el customer añadiéndole la reserva con el nombre del local
          Customer.findByIdAndUpdate(req.session.currentUser._id, {
            $push: {
              bookings: bookingCliente
            }
          }, {
            new: true
          }).then(customer => console.log(customer)).catch(error => {
            console.log('Error: ', error);
          });

          // GUARDANDO LA RESERVA EN LA PROPERTY
          const bookingProperty = {
            bookingId: booking._id,
            bookingRef: booking.bookingRef,
          }
          Property.findByIdAndUpdate(booking.property, {
            $push: {
              bookings: bookingProperty
            }},
            {
              new: true
            }
          ).then(customer => console.log(customer)).catch(error => {
            console.log('Error: ', error);
          });
        }

      ).catch(error => {
        console.log('Error: ', error);
      });

    })
    .catch(error => {
      console.log('Error: ', error);
    });

};

exports.deleteBooking = (req, res) => {
  const bookingRef = req.params.bookingRef;
  console.log("BOOKING REF", bookingRef);
  const p1 = Booking.findOneAndDelete({
    bookingRef: {
      $eq: bookingRef
    }
  });
  const p2 = Customer.findByIdAndUpdate({
    _id: req.session.currentUser._id
  }, {
    $pull: {
      bookings: {
        bookingRef: bookingRef
      }
    }
  });

  Promise.all([p1, p2])
    .then(resultados => {
      console.log(resultados);
      res.redirect('/profile');
    })
    .catch(error => {
      console.log('Error: ', error);
    });
};