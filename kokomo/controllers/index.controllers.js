const Property = require('../models/property.model');
const Schedule = require('../models/schedule.model');
const Booking = require('../models/booking.model');
const Customer = require('../models/customer.model');

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
      console.log('Error: ', error);
    });

};

exports.bookingDay = (req, res, next) => {
  const propertyId = req.params.id;
  let bookingDate = req.body.bookingDate;
  let newDate = new Date(bookingDate);

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
      const allSchedules = schedules[0].time_boxes;

      const finalSchedules = allSchedules.filter(element => element.day.getTime() == newDate.getTime());

      res.render("property/booking-options", {
        property: theProperty,
        schedule: finalSchedules
      });
    })
    .catch(error => {
      console.log('Error: ', error);
    });
};

exports.createBooking = (req, res, next) => {
  console.log("Schedule ID: ", req.params.id);
  console.log("Body: ", req.body);

  const {
    day,
    propertyId
  } = req.body;
  let finalTimebox;

  Schedule.find({
      property: {
        $eq: propertyId
      }
    })
    .then(resultado => {
      //Filtrar el timebox seleccionado
      const timeboxes = resultado[0].time_boxes;
      finalTimebox = timeboxes.filter(element => element._id == req.params.id);
      console.log("Final timebox: ", finalTimebox);
      //Crear la reserva
      return Booking.create({
        customer: req.session.currentUser._id,
        property: propertyId,
        time: day,
        guests: 4
      })
    })
    .then(booking => {
      console.log("Customer: ",req.session.currentUser._id);
      console.log("Reserva creada: ", booking);
      res.render('property/booking-details', booking);
      //actualizar el perfil del cliente
      const bookingCliente = {
        id: booking._id, 
        property: booking.property, 
        time: booking.time, 
        guests: booking.guests
      }
      Customer.findOneAndUpdate({
        _id: req.session.currentUser._id
        }, {
        $push: { bookings:  bookingCliente} 
      }, {
        new: true
      }).then(customer => console.log(customer)).catch(error => {
        console.log('Error: ', error);
      });
    })
    .catch(error => {
      console.log('Error: ', error);
    });

};