const mongoose = require('mongoose');
const Property = require('../models/property.model');
const Schedule = require('../models/schedule.model');


// require database configuration
require('../config/db.config');

Schedule.collection.drop();


function createSchedule(property) {

    const timeRanges = property.opningHours;
    const bookTime = property.bookingDuration;
    var scheduleObject = {
        property: property._id,
        time_boxes: []
    };
    let newSchedule;
    timeRanges.forEach(timeRange => {
        const openDays = (timeRange. openingDays.closingDay.getTime() - timeRange.openingDays.openingDay.getTime()) / (1000 * 3600 * 24);
        const weekDays = timeRange.weekDays;
        var currentDay = timeRange.openingDays.openingDay;
    
        for (let i = 0; i < openDays; i++) {
            if (weekDays.includes(currentDay.getDay())) {
                timeRange.opening_times.forEach(opening => {
                    var interval = bookTime / 60;
                    let hours = opening.closingTime - opening.openingTime;
                    let total = hours / interval;
                    let t = opening.openingTime;
                    let rest = 0;
                    let startTime = t+rest;
                    var timeBox = {
                        day: currentDay,
                        startTime: startTime,
                        status: true,
                        remaining: property.availablePlaces,
                        total: property.availablePlaces
                    }
                    for (let j = 0; j < total; j++) {
                        t = t + (bookTime / 100);

                        if ((t - Math.floor(t)) >= 0.60) {
                            let rest = (t - Math.floor(t)) - 0.60;
                            t = Math.floor(t) + rest + 1;

                        }
                        
                        timeBox = {
                            day: new Date(currentDay),
                            startTime: startTime.toFixed(2).replace(".",":"),
                            status: true,
                            remaining: property.availablePlaces,
                            total: property.availablePlaces
                        };
                        scheduleObject.time_boxes.push(timeBox)
                        startTime = t+rest;
                        
                    }
                })
                newSchedule = JSON.parse(JSON.stringify(scheduleObject));
                
                currentDay.setDate(currentDay.getDate() + 1);
              
            } else {
                currentDay.setDate(currentDay.getDate() + 1);
            }
        }
    });

   // console.log(newSchedule);
   Schedule.create(newSchedule, err => {
        if (err) {
            throw err;
        }
        console.log(`Created ${scheduleObject.property} schedules`);
    });
}

Property.find().then(properties => properties.forEach(property => createSchedule(property)));