const Property = require("../models/property.model");
const Schedule = require("../models/schedule.model");
const Booking = require("../models/booking.model");
const Customer = require("../models/customer.model");
const uploadCloud = require("../config/cloudinary.js");
const { registerOwner } = require("./auth.controllers");
const dateFormat = require("dateformat");
const Swal = require("sweetalert2");


//HOME
exports.allProperties = (req, res, next) => {
  const sessionUser = req.session.currentUser || req.user;
  // Si hay usuario cogemos también los locales favoritos para marcarlos
  if (sessionUser) {
    const p1 = Customer.findById(sessionUser._id);
    const p2 = Property.find();

    Promise.all([p1, p2])
      .then((results) => {
        const favourites = results[0].favourites;
        const properties = results[1];

        res.render("index", {
          properties: properties,
          title: "KOKOMO | ¡Haz tu reserva!",
          user: sessionUser,
          favourites: favourites,
        });

        return;
      })
      .catch((error) => {
        console.log("Error while getting the properties from the DB: ", error);
      });
  } else {
    // si no hay usuario cargamos solamente los locales
    Property.find()
      .then((properties) => {
        res.render("landing-page", {
          properties: properties,
          title: "KOKOMO | ¡Haz tu reserva!",
          layout: "layout-nouser",
        });
      })
      .catch((error) => {
        console.log("Error while getting the properties from the DB: ", error);
      });
  }
};

exports.ownerViewLocal = (req, res, next) => {
  const sessionUser = req.session.currentUser || req.user;
  Property.findById(req.params.id)
    .then((resultado) => {
      const getBookings = async () => {
        return Promise.all(
          resultado.bookings.map(async (booking) => {
            var item = await Booking.findById(booking.bookingId);
            return item;
          })
        );
      };

      getBookings()
        .then((bookings) => {
          console.log(bookings);
          console.log(resultado);
          res.render("owner/property-details", {
            property: resultado,
            bookings: bookings,
            title: `${resultado.name} | KOKOMO`,
            user: sessionUser,
          });
        })
        .catch((error) => {
          console.log("Error: ", error);
        });
    })
    .catch((error) => {
      console.log("Error: ", error);
    });
};







exports.addComment = (req, res) => {
  const sessionUser = req.session.currentUser || req.user;
  const newComment = {
    username: sessionUser.username,
    comment: req.body.comment,
  };

  Property.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        comments: newComment,
      },
    },
    {
      new: true,
    }
  ).then((propertyUpdated) => {
    console.log(propertyUpdated);
    res.redirect(`/local/${propertyUpdated._id}`);
  });
};



exports.deleteBooking = (req, res) => {
  const bookingId = req.params.id;
  const sessionUser = req.session.currentUser || req.user;

  Booking.findById(bookingId).then((booking) => {
    console.log("this is booking", booking);
    Schedule.update(
      {
        "timeBoxes._id": booking.timeBox,
      },
      {
        $inc: {
          "timeBoxes.$.remaining": booking.guests,
        },
      }
    );
  });
  const p1 = Booking.findByIdAndDelete(bookingId);
  const p2 = Customer.findByIdAndUpdate(
    {
      _id: sessionUser._id,
    },
    {
      $pull: {
        bookings: bookingId,
      },
    }
  );
  const p3 = Property.findOneAndUpdate(
    {},
    {
      $pull: {
        bookings: bookingId,
      },
    }
  );
  Promise.all([p1, p2, p3])
    .then((resultados) => {
      res.redirect("/my-bookings");
    })
    .catch((error) => {
      console.log("Error: ", error);
    });
};

exports.viewCategory = (req, res) => {
  const sessionUser = req.session.currentUser || req.user;

  if(sessionUser){
    Property.find({ categories: req.params.name })
    .then((properties) => {
      res.render("property/category", {
        category: req.params.name,
        user: sessionUser,
        properties: properties
      });
    })
    .catch((error) => {
      console.log("Error: ", error);
    });
  } else {
    Property.find({ categories: req.params.name })
    .then((properties) => {
      res.render("property/category", {
        category: req.params.name,
        user: sessionUser,
        properties: properties,
        layout: 'layout-nouser'
      });
    })
    .catch((error) => {
      console.log("Error: ", error);
    });
  }

};

