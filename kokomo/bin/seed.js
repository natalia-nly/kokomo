// bin/seeds.js
const mongoose = require('mongoose');
const Property = require('../models/property.model');

// require database configuration
require('../config/db.config');


const properties = [
  {
    name: 'Chalito',
    descriptions: [{
      language: 'SP',
      description: 'El Chiringo de Paco'
  }],
  categories:['Surfer'],
  media:['https://uh.gsstatic.es/sfAttachPlugin/744809.jpg'],
  location: {
    name: 'Castelldefels',
    lat: 41.265324,
    long: 1.991943
},
opening_hours:[{
  opening_days:{
      opening_day: "2020-06-14",
      closing_day: "2030-06-14"
  },
  week_days:['MO','TU','ST', 'SU'],
  opening_times:[
      {
        opening_time: 13,
        closing_time: 00
      }
  ]
}],
booking_duration: 30,
available_places: 20,
  },
  {
    name: 'Chalito2',
    descriptions: [{
      language: 'SP',
      description: 'El Chiringo de Paco'
  }],
  categories: ['Surfer'],
  media:['https://uh.gsstatic.es/sfAttachPlugin/744809.jpg'],
  location: {
    name: 'Castelldefels',
    lat: 41.265324,
    long: 1.991943
},
opening_hours:[{
  opening_days:{
      opening_day: "2020-06-14",
      closing_day: "2030-06-14"
  },
  week_days:['MO','TU','ST', 'SU'],
  opening_times:[
      {
      opening_time: 13,
      closing_time: 00
      }
  ]
}],
booking_duration: 30,
available_places: 20,
  },
  {
    name: 'Chalito3',
    descriptions: [{
      language: 'SP',
      description: 'El Chiringo de Paco'
  }],
  categories: ['Surfer'], 
  media:['https://uh.gsstatic.es/sfAttachPlugin/744809.jpg'],
  location: {
    name: 'Castelldefels',
    lat: 41.265324,
    long: 1.991943
},
opening_hours:[{
  opening_days:{
      opening_day: "2020-06-14",
      closing_day: "2030-06-14"
  },
  week_days:['MO','TU','ST', 'SU'],
  opening_times:[
      {
        opening_time: 13,
        closing_time: 00
      }
  ]
}],
booking_duration: 30,
available_places: 20,
  },
  {
    name: 'Chalito4',
    descriptions: [{
      language: 'SP',
      description: 'El Chiringo de Paco'
  }],
  categories: ['Surfer'],  
  media:['https://uh.gsstatic.es/sfAttachPlugin/744809.jpg'],
  location: {
    name: 'Castelldefels',
    lat: 41.265324,
    long: 1.991943
},
opening_hours:[{
  opening_days:{
      opening_day: "2020-06-14",
      closing_day: "2030-06-14"
  },
  week_days:['MO','TU','ST', 'SU'],
  opening_times:[
      {
        opening_time: 13,
        closing_time: 00
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
