const Property = require("../models/property.model");
const Schedule = require("../models/schedule.model");

//Función para determinar los schedules válidos para la búqueda
function filterSchedules(day, guests, schedules) {
  const newDate = new Date(day);
  const finalSchedules = schedules.filter(
    (element) =>
    element.day.getTime() == newDate.getTime() &&
    element.remaining >= guests
  );

  return finalSchedules;
}
//Página de búsqueda
exports.newSearch = (req, res, next) => {
  res.render('search');
};
//Búsqueda de los locales/schedules disponibles
exports.searchResults = (req, res, next) => {
  Schedule.find({
      "timeBoxes.day": {
        $eq: req.body.bookingDate
      },
      "timeBoxes.remaining": {
        $gte: req.body.numberGuests
      }
    })
    .populate('property')
    .then(schedules => {
      const finalResults = schedules.map(element => {
        const finalSchedules = filterSchedules(req.body.bookingDate, req.body.numberGuests, element.timeBoxes);
        let obj = {
          property: element.property,
          timeboxes: finalSchedules,
          guests: req.body.numberGuests
        };
        return obj;
      });
      console.log("FINAL RESULTS", finalResults);
      res.render('search-result', {
        schedule: finalResults
      });
    })
    .catch((error) => {
      console.log("Error: ", error);
    });
};
//Búsqueda de disponibilidad en un local
exports.bookingDay = (req, res, next) => {
  const propertyId = req.params.id;
  let bookingDate = req.body.bookingDate;
  //let newDate = new Date(bookingDate);
  let newGuests = req.body.numberGuests;
  console.log(newGuests);

  const p1 = Property.findById(req.params.id);
  const p2 = Schedule.find({
    property: {
      $eq: propertyId,
    },
  });
  const sessionUser = req.session.currentUser || req.user;
  Promise.all([p1, p2])
    .then((resultados) => {
      const theProperty = resultados[0];
      const schedules = resultados[1];
      const allSchedules = schedules[0].timeBoxes;
      const finalSchedules = filterSchedules(bookingDate, newGuests, allSchedules);
      res.render("property/booking-options", {
        property: theProperty,
        schedule: finalSchedules,
        newDate: bookingDate,
        newGuests: newGuests,
        guests: newGuests,
        user: sessionUser,
        title: `${theProperty.name} | KOKOMO`,
      });
    })
    .catch((error) => {
      console.log("Error: ", error);
    });
};
//Búsqueda de locales por Categoría
exports.viewCategory = (req, res) => {
  const sessionUser = req.session.currentUser || req.user;
  if (sessionUser) {
    Property.find({
        categories: req.params.name
      })
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
    Property.find({
        categories: req.params.name
      })
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