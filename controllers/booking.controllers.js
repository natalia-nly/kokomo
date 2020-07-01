const Property = require("../models/property.model");
const Schedule = require("../models/schedule.model");
const Booking = require("../models/booking.model");
const Customer = require("../models/customer.model");

//Creador de Código de Reserva
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
//Formateo de fecha
function formattedDate(d) {
  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  const year = String(d.getFullYear());
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return `${day}/${month}/${year}`;
}
//Creación del Booking
exports.createBooking = (req, res, next) => {
  console.log("Schedule ID: ", req.params.id);
  console.log("Body: ", req.body);
  const sessionUser = req.session.currentUser || req.user;
  let {
    day,
    propertyId,
    guests
  } = req.body;
  Schedule.find({
      "timeBoxes._id": {
        $eq: req.params.id,
      },
    })
    .then(([{
      timeBoxes
    }]) => {
      //Filtrar el timebox seleccionado
      const [finalTimebox] = timeBoxes.filter(
        (element) => element._id == req.params.id
      );
      const [{
        startTime
      }] = timeBoxes.filter(
        (element) => element._id == req.params.id
      );
      const bookingRef = uniqueId();
      day = formattedDate(new Date(day));
      const remainingUpdate = finalTimebox.remaining - guests;
      Schedule.updateOne({
        property: propertyId,
        "timeBoxes._id": req.params.id,
      }, {
        $set: {
          "timeBoxes.$.remaining": remainingUpdate,
        },
      }).then((finalbox) => console.log(finalbox));
      //Crear la reserva en la colección de bookings
      return Booking.create({
        customer: sessionUser._id,
        /*customerName: sessionUser.username,
        telNumber: sessionUser.telNumber,*/
        property: propertyId,
        day: day,
        bookingRef: bookingRef,
        timeBox: finalTimebox._id,
        time: finalTimebox.startTime,
        guests: guests,
      });
    })
    .then((booking) => {
      //console.log("Customer: ",req.session.currentUser._id);
      console.log("Reserva creada: ", booking);
      res.render("property/booking-details", {
        booking: booking,
        user: sessionUser,
        title: `Reserva creada | KOKOMO`,
      });
      // Actualizar el perfil del cliente
      Customer.findByIdAndUpdate(
          sessionUser._id, {
            $push: {
              bookings: booking._id,
            },
          }, {
            new: true,
          }
        )
        .then((customer) => console.log(customer))
        .catch((error) => {
          console.log("Error: ", error);
        });
      // GUARDANDO LA RESERVA EN LA PROPERTY
      Property.findByIdAndUpdate(
          booking.property, {
            $push: {
              bookings: booking._id,
            },
          }, {
            new: true,
          }
        )
        .then((customer) => console.log(customer))
        .catch((error) => {
          console.log("Error: ", error);
        });
    })
    .catch((error) => {
      console.log("Error: ", error);
    });
};
//Ver Bookings - listado
exports.myBookings = (req, res, next) => {
  const sessionUser = req.session.currentUser || req.user;
  // BOOKINGS DEL OWNER
  if (sessionUser.owner) {
    Customer.findById(sessionUser._id).populate({
        path: 'ownProperties',
        populate: {
          path: 'bookings',
          populate: {
            path: 'customer'
          }
        } 
      }).populate({
        path: 'bookings',
        populate: {
          path: 'property'
        }
      })
      .then(user => {
        console.log("USER CON DEEP POPULATE: ", user);
        res.render('owner/bookings', {
          user,
          title: 'Mis reservas | KOKOMO'
        });
      }).catch(error => next(error));
  }
  // BOOKINGS DEL CUSTOMER
  else {
    Customer.findById(sessionUser._id)
      .populate({
        path: 'bookings',
        populate: {
          path: 'property'
        }
      })
      .then(user => {
        res.render('customer/bookings', {
          user,
          title: 'Mis reservas | KOKOMO'
        });
      }).catch(error => next(error));
  }
};
//Detalles del booking
exports.bookingDetails = (req, res) => {
  Booking.findById(req.params.id)
    .then((booking) => {
      console.log("BOOKING: ", booking);
      res.render("customer/booking-details", {
        booking: booking,
        layout: "layout-nouser"
      });
    })
    .catch((error) => {
      console.log("Error: ", error);
    });
};
//Borrar una reserva
exports.deleteBooking = (req, res) => {
  const bookingId = req.params.id;
  const sessionUser = req.session.currentUser || req.user;
  Booking.findById(bookingId).then((booking) => {
    console.log("this is booking", booking);
    Schedule.update({
      "timeBoxes._id": booking.timeBox,
    }, {
      $inc: {
        "timeBoxes.$.remaining": booking.guests,
      },
    });
  });
  const p1 = Booking.findByIdAndDelete(bookingId);
  const p2 = Customer.findByIdAndUpdate({
    _id: sessionUser._id,
  }, {
    $pull: {
      bookings: bookingId,
    },
  });
  const p3 = Property.findOneAndUpdate({}, {
    $pull: {
      bookings: bookingId,
    },
  });
  Promise.all([p1, p2, p3])
    .then((resultados) => {
      res.redirect("/my-bookings");
    })
    .catch((error) => {
      console.log("Error: ", error);
    });
};