const Property = require('../models/property.model');
const Schedule = require('../models/schedule.model');
const Booking = require('../models/booking.model');
const Customer = require('../models/customer.model');

exports.allProperties = (req, res, next) => {

  Property.find()
    .then(allProp => {
      if(req.session.currentUser){
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

exports.bookingDay = (req, res, next) => {
  const propertyId = req.params.id;
  let bookingDate = req.body.bookingDate;
  let newDate = new Date(bookingDate);
  let newGuests = req.body.numberGuests;
  console.log(newGuests);

  const p1 = Property.findById(req.params.id);
  const p2 = Schedule.find({property: {$eq: propertyId}});

  Promise.all([p1, p2])
    .then(resultados => {
      const theProperty = resultados[0];
      const schedules = resultados[1];
      const allSchedules = schedules[0].time_boxes;
      const finalSchedules = allSchedules.filter(element => element.day.getTime() == newDate.getTime() && element.remaining >= newGuests);

      res.render("property/booking-options", {
        property: theProperty,
        schedule: finalSchedules,
        guests: newGuests,
        user: req.session.currentUser,
        title: `${theProperty.name} | KOKOMO`,
      });
    })
    .catch(error => {
      console.log('Error: ', error);
    });
};

function uniqueId(stringLength, possible)
{
  stringLength =  5;
  possible = "ABCDEFGHJKMNPQRSTUXY12345";
  var text = "";

  for(var i = 0; i < stringLength; i++) {
    var character = getCharacter(possible);
    while(text.length > 0 && character === text.substr(-1)) {
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

  let {day, propertyId, guests} = req.body;
 
  ////////////////////////////////////

  Schedule.find({"time_boxes._id": {$eq: req.params.id}})
    .then(([{time_boxes}]) => {
      //Filtrar el timebox seleccionado
      const [finalTimebox] = time_boxes.filter(element => element._id == req.params.id);
      const [{start_time}] = time_boxes.filter(element => element._id == req.params.id);
      const bookingRef = uniqueId();
      day =  formattedDate(new Date(day));
      const remainingUpdate = finalTimebox.remaining - guests;
    

      Schedule.updateOne(
        { property: propertyId, "time_boxes._id": req.params.id },
        { $set: { "time_boxes.$.remaining" : remainingUpdate } }
      ).then(finalbox => console.log(finalbox));

      
      //Crear la reserva en la colección de bookings
      return Booking.create({
        customer: req.session.currentUser._id,
        property: propertyId,
        day: day,
        booking_ref: bookingRef,
        time: finalTimebox.start_time,
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
      Property.findById(booking.property).then(property =>{
        const bookingCliente = {
          booking_id: booking._id, 
          booking_ref: booking.booking_ref,
          guests: booking.guests,
          property: property.name,
          day: booking.day,
          time:booking.time
        };
        // Actualizar el customer añadiéndole la reserva con el nombre del local
        Customer.findByIdAndUpdate(req.session.currentUser._id, 
        {
          $push: { bookings:  bookingCliente} 
        }, {
          new: true
        }).then(customer => console.log(customer)).catch(error => {
          console.log('Error: ', error);
        });

        // GUARDANDO LA RESERVA EN LA PROPERTY
        Property.findByIdAndUpdate(booking.property, {
          $push: { bookings:  bookingCliente.booking_id} 
        }, {new: true}).then(customer => console.log(customer)).catch(error => {
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
  const bookingRef = req.params.booking_ref;
  console.log("BOOKING REF", bookingRef);
  const p1 = Booking.findOneAndDelete({booking_ref: {$eq: bookingRef}});
  const p2 =Customer.findByIdAndUpdate({
    _id: req.session.currentUser._id
    }, {
    $pull: { bookings: {booking_ref:bookingRef}} 
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