const Property = require('../models/schedule.model');

exports.createScheduleProperty = (req, res, next) => {
    Property.find()
    .then(allProp => {
        console.log(allProp);
      res.render('index', { properties: allProp });
    })
    .catch(error => {
      console.log('Error while getting the properties from the DB: ', error);
    });
   
};