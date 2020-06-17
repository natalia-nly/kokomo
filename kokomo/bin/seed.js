// bin/seeds.js
const mongoose = require('mongoose');
const Property = require('../models/property.model');

// require database configuration
require('../config/db.config');


const properties = [
  {
    name: 'Chalito',
    description: 'El Chiringo de Paco',
  categories:['Surfer'],
  main_image: '/images/chiringuito1.jpg',
  media:['https://uh.gsstatic.es/sfAttachPlugin/744809.jpg'],
  location: {
    name: 'Castelldefels',
    lat: 41.265324,
    long: 1.991943
},
opening_hours:[{
  opening_days:{
    opening_day: "2020-06-17",
    closing_day: "2020-07-14"
  },
  week_days:[1, 3, 4, 0],
  opening_times:[
      {
        opening_time: 13.00,
        closing_time: 24.00
      }
  ]
}],
booking_duration: 30,
available_places: 20,
  },
  {
    name: 'Chalito2',
    description: 'El mejor chiringuito de Castelldefels',
  categories: ['Surfer'],
  main_image: '/images/chiringuito2.jpg',
  media:['https://uh.gsstatic.es/sfAttachPlugin/744809.jpg'],
  location: {
    name: 'Castelldefels',
    lat: 41.265324,
    long: 1.991943
},
opening_hours:[{
  opening_days:{
    opening_day: "2020-06-17",
    closing_day: "2020-07-14"
  },
  week_days:[1, 3, 4, 0],
  opening_times:[
      {
      opening_time: 13.00,
      closing_time: 24.00
      }
  ]
}],
booking_duration: 30,
available_places: 20,
  },
  {
    name: 'Chalito3',
    description: 'El Chiringo de Paco',
  categories: ['Surfer'], 
  main_image: '/images/chiringuito3.jpg',
  media:['https://uh.gsstatic.es/sfAttachPlugin/744809.jpg'],
  location: {
    name: 'Castelldefels',
    lat: 41.265324,
    long: 1.991943
},
opening_hours:[{
  opening_days:{
    opening_day: "2020-06-17",
    closing_day: "2020-07-14"
  },
  week_days:[1, 3, 4, 0],
  opening_times:[
      {
        opening_time: 13.00,
        closing_time: 24.00
      }
  ]
}],
booking_duration: 30,
available_places: 20,
  },
  {
    name: 'Chalito4',
    description: 'El Chiringo de Paco',
  categories: ['Surfer'], 
  main_image: '/images/chiringuito4.jpg', 
  media:['https://uh.gsstatic.es/sfAttachPlugin/744809.jpg'],
  location: {
    name: 'Castelldefels',
    lat: 41.265324,
    long: 1.991943
},
opening_hours:[{
  opening_days:{
    opening_day: "2020-06-17",
    closing_day: "2020-07-14"
  },
  week_days:[1, 3, 4, 0],
  opening_times:[
      {
        opening_time: 13.00,
        closing_time: 24.00
      }
  ]
}],
booking_duration: 30,
available_places: 20,
  }
 
];

Property.create(properties, err => {
  if (err) {
    throw err;
  }
  console.log(`Created ${properties.length} properties`);
  mongoose.connection.close();
});
