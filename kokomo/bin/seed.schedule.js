const mongoose = require('mongoose');
const Property = require('../models/property.model');
const Schedule = require('../models/schedule.model');


// require database configuration
require('../config/db.config');


function createSchedule(property) {

    const timeRanges = property.opening_hours;
    const bookTime = property.booking_duration;
    var scheduleObject = {
        property: property._id,
        time_boxes: []
    };
    let newSchedule;
    timeRanges.forEach(timeRange => {
        const openDays = (timeRange.opening_days.closing_day.getTime() - timeRange.opening_days.opening_day.getTime()) / (1000 * 3600 * 24);
        const weekDays = timeRange.week_days;
        var currentDay = timeRange.opening_days.opening_day;
    
        for (let i = 0; i < openDays; i++) {
            if (weekDays.includes(currentDay.getDay())) {
                timeRange.opening_times.forEach(opening => {
                    var interval = bookTime / 60;
                    let hours = opening.closing_time - opening.opening_time;
                    let total = hours / interval;
                    let t = opening.opening_time;
                    let rest = 0;
                    let startTime = t+rest;
                    var time_box = {
                        day: currentDay,
                        start_time: startTime,
                        status: true,
                        remaining: property.available_places,
                        total: property.available_places
                    }
                    for (let j = 0; j < total; j++) {
                        t = t + (bookTime / 100);

                        if ((t - Math.floor(t)) >= 0.60) {
                            let rest = (t - Math.floor(t)) - 0.60;
                            t = Math.floor(t) + rest + 1;

                        }
                        
                        time_box = {
                            day: new Date(currentDay),
                            start_time: startTime.toFixed(2).replace(".",":"),
                            status: true,
                            remaining: property.available_places,
                            total: property.available_places
                        };
                        scheduleObject.time_boxes.push(time_box)
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