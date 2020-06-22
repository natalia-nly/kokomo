// bin/seeds.js
const mongoose = require('mongoose');
const Property = require('../models/property.model');

// require database configuration
require('../config/db.config');

Property.collection.drop();


const properties = [
  {
    name: 'Chalito',
    description: 'El Chiringo de Paco',
  categories:['Surfer'],
  mainImage: '/images/chiringuito1.jpg',
  media:['https://uh.gsstatic.es/sfAttachPlugin/744809.jpg'],
  location: {
    name: 'Castelldefels',
    lat: 41.265324,
    long: 1.991943
},
opningHours:[{
  openingDays:{
     openingDay: "2020-06-17",
    closingDay: "2020-07-14"
  },
 weekDays:[1, 3, 4, 0],
  openingTimes:[
      {
        openingTime: 13.00,
        closingTime: 24.00
      }
  ]
}],
bookingDuration: 30,
availablePlaces: 20,
  },
  {
    name: 'Chalito2',
    description: 'El mejor chiringuito de Castelldefels',
  categories: ['Surfer'],
  mainImage: '/images/chiringuito2.jpg',
  media:['https://uh.gsstatic.es/sfAttachPlugin/744809.jpg'],
  location: {
    name: 'Castelldefels',
    lat: 41.265324,
    long: 1.991943
},
opningHours:[{
  openingDays:{
     openingDay: "2020-06-17",
    closingDay: "2020-07-14"
  },
 weekDays:[1, 3, 4, 0],
  openingTimes:[
      {
      openingTime: 13.00,
      closingTime: 24.00
      }
  ]
}],
bookingDuration: 30,
availablePlaces: 20,
  }
 
];

Property.create(properties, err => {
  if (err) {
    throw err;
  }
  console.log(`Created ${properties.length} properties`);
  mongoose.connection.close();
});
