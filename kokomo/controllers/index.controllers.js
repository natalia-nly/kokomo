const Property = require('../models/property.model');
const Schedule = require('../models/schedule.model');

exports.allProperties = (req, res, next) => {
    Property.find()
    .then(allProp => {
      res.render('index', { 
        properties: allProp, 
        title: 'KOKOMO | ¡Haz tu reserva!',
        user: req.session.currentUser 
      });
    })
    .catch(error => {
      console.log('Error while getting the properties from the DB: ', error);
    });
   
};

exports.viewLocal = (req, res, next) => {
  Property.findById(req.params.id)
  .then(resultado => {
    res.render("property/property-details", resultado);
  })
  .catch(error => {
    console.log('Error while retrieving book details: ', error);
  });

};

exports.bookingDay = (req, res, next) => {
  const propertyId = req.params.id;
  let bookingDate = req.body.bookingDate;
  let newDate = new Date(bookingDate);

  const p1 = Property.findById(req.params.id);
  const p2 = Schedule.find({property: {$eq: propertyId}});
  Promise.all([p1, p2])
  .then(resultados => {
    const theProperty = resultados[0];
    const schedules = resultados[1];
    const allSchedules = schedules[0].time_boxes;

    const finalSchedules = allSchedules.filter(element => element.day.getTime() == newDate.getTime());

    res.render("property/booking-options", {property: theProperty, schedule: finalSchedules});
  })
  .catch(error => {
    console.log('Error: ', error);
  });

  /*
  Property.findById(req.params.id)
  .then(resultado => {
    res.render("property/property-details", resultado);
  })
  .catch(error => {
    console.log('Error while retrieving book details: ', error);
  });
  */

};