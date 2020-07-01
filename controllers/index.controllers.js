const Property = require("../models/property.model");
const Customer = require("../models/customer.model");

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

/*exports.ownerViewLocal = (req, res, next) => {
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
};*/












