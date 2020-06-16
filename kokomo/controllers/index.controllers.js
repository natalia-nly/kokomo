const Property = require('../models/property.model');

exports.allProperties = (req, res, next) => {
    Property.find()
    .then(allProp => {
        console.log(allProp);
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