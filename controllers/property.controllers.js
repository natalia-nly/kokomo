const Property = require("../models/property.model");
const Schedule = require("../models/schedule.model");
const Booking = require("../models/booking.model");
const Customer = require("../models/customer.model");
const uploadCloud = require("../config/cloudinary.js");
const {
    registerOwner
} = require("./auth.controllers");
const dateFormat = require("dateformat");
const Swal = require("sweetalert2");


//GET Form creación del local
exports.createProperty = (req, res, next) => {
    const sessionUser = req.session.currentUser || req.user;
    res.render("property/create-property", {
        title: "Crea tu local | KOKOMO",
        layout: "layout",
        user: sessionUser,
    });
};

//Función creadora de Schedules para un local
function createSchedule(property) {
    const timeRanges = property.openingHours;
    const bookTime = property.bookingDuration;
    var scheduleObject = {
        property: property._id,
        timeBoxes: [],
    };
    let newSchedule;
    timeRanges.forEach((timeRange) => {
        const openDays =
            (timeRange.openingDays.closingDay.getTime() -
                timeRange.openingDays.openingDay.getTime()) /
            (1000 * 3600 * 24);
        const weekDays = timeRange.weekDays;
        var currentDay = timeRange.openingDays.openingDay;
        for (let i = 0; i < openDays; i++) {
            if (weekDays.includes(currentDay.getDay())) {
                timeRange.openingTimes.forEach((opening) => {
                    var interval = bookTime / 60;
                    let hours = opening.closingTime - opening.openingTime;
                    let total = hours / interval;
                    let t = opening.openingTime;
                    let rest = 0;
                    let startTime = t + rest;
                    var timeBox = {
                        day: currentDay,
                        startTime: startTime,
                        status: true,
                        remaining: property.availablePlaces,
                        total: property.availablePlaces,
                    };
                    for (let j = 0; j < total; j++) {
                        t = t + bookTime / 100;
                        if (t - Math.floor(t) >= 0.6) {
                            let rest = t - Math.floor(t) - 0.6;
                            t = Math.floor(t) + rest + 1;
                        }
                        timeBox = {
                            day: new Date(currentDay),
                            startTime: startTime.toFixed(2).replace(".", ":"),
                            status: true,
                            remaining: property.availablePlaces,
                            total: property.availablePlaces,
                        };
                        console.log("TimBox:" + timeBox);
                        scheduleObject.timeBoxes.push(timeBox);
                        startTime = t + rest;
                    }
                });
                console.log(scheduleObject);
                newSchedule = JSON.parse(JSON.stringify(scheduleObject));

                currentDay.setDate(currentDay.getDate() + 1);
            } else {
                currentDay.setDate(currentDay.getDate() + 1);
            }
        }
    });
    Schedule.create(newSchedule, (err) => {
        if (err) {
            throw err;
        }
        console.log(`Created ${scheduleObject.property} schedules`);
    });
}

//POST Creación del local
exports.registerProperty = (req, res, next) => {
    console.log(req.body);
    const workingDays = [];
    if (req.body.monday) {
        workingDays.push(req.body.monday);
    }
    if (req.body.tuesday) {
        workingDays.push(req.body.tuesday);
    }
    if (req.body.wednesday) {
        workingDays.push(req.body.wednesday);
    }
    if (req.body.thursday) {
        workingDays.push(req.body.thursday);
    }
    if (req.body.friday) {
        workingDays.push(req.body.friday);
    }
    if (req.body.satuday) {
        workingDays.push(req.body.saturday);
    }
    if (req.body.sunday) {
        workingDays.push(req.body.sunday);
    }
    const sessionUser = req.session.currentUser || req.user;
    const dataProperty = {
        owner: sessionUser,
        name: req.body.name,
        description: req.body.description,
        categories: [req.body.categories],
        media: [req.body.media],
        location: {
            name: req.body.ubication,
            lat: req.body.latitude,
            long: req.body.longitude,
        },
        openingHours: [{
            openingDays: {
                openingDay: req.body.opening,
                closingDay: req.body.closing,
            },
            weekDays: workingDays,
            openingTimes: [{
                openingTime: req.body.openhour,
                closingTime: req.body.closehour,
            }, ],
        }, ],
        bookingDuration: req.body.duration,
        availablePlaces: req.body.places,
    };
    if (req.file) {
        dataProperty.mainImage = req.file.path;
    }
    Property.create(dataProperty).then((property) => {
        createSchedule(property);
        Customer.findByIdAndUpdate(
                sessionUser._id, {
                    $push: {
                        ownProperties: property._id,
                    },
                }, {
                    new: true,
                }
            )
            .then((customer) => {
                console.log(customer);
            })
            .catch((error) => {
                console.log("Error: ", error);
            });
        res.render("property/property-details", {
            title: "Local creado | KOKOMO",
            layout: "layout",
            user: sessionUser,
            property: property
        });
    });
};

//Ver detalle del local
exports.viewProperty = (req, res, next) => {
    const sessionUser = req.session.currentUser || req.user;
    if (sessionUser) {
        const p1 = Customer.findById(sessionUser._id);
        const p2 = Property.findById(req.params.id);
        Promise.all([p1, p2])
            .then((resultados) => {
                const favourites = resultados[0].favourites;
                console.log(resultados)
                const property = resultados[1];
                const openingDay = property.openingHours[0].openingDays.openingDay;
                const closingDay = property.openingHours[0].openingDays.closingDay;
                const formatOpening = dateFormat(openingDay, "dd/mm/yyyy");
                const formatClosing = dateFormat(closingDay, "dd/mm/yyyy");
                const weekDays = property.openingHours[0].weekDays;
                const weekDaysFormat = [];
                weekDays.forEach((day) => {
                    switch (day) {
                        case 1:
                            weekDaysFormat.push("Lunes");
                            break;
                        case 2:
                            weekDaysFormat.push("Martes");
                            break;
                        case 3:
                            weekDaysFormat.push("Miércoles");
                            break;
                        case 4:
                            weekDaysFormat.push("Jueves");
                            break;
                        case 5:
                            weekDaysFormat.push("Viernes");
                            break;
                        case 6:
                            weekDaysFormat.push("Sábado");
                            break;
                        case 7:
                            weekDaysFormat.push("Domingo");
                    }
                });
                console.log(property.openingHours[0].openingTimes[0]);
                res.render("property/property-details", {
                    property: property,
                    title: `${property.name} | KOKOMO`,
                    user: resultados[0],
                    favourites: favourites,
                    openingDay: formatOpening,
                    closingDay: formatClosing,
                    weekDays: weekDaysFormat,
                    openingTime: property.openingHours[0].openingTimes[0].openingTime,
                    closingTime: property.openingHours[0].openingTimes[0].closingTime,
                });
            })
            .catch((error) => {
                console.log("Error: ", error);
            });
    } else {
        Property.findById(req.params.id)
            .then((resultados) => {
                const property = resultados;
                const openingDay = property.openingHours[0].openingDays.openingDay;
                const closingDay = property.openingHours[0].openingDays.closingDay;
                const formatOpening = dateFormat(openingDay, "dd/mm/yyyy");
                const formatClosing = dateFormat(closingDay, "dd/mm/yyyy");
                const weekDays = property.openingHours[0].weekDays;
                const weekDaysFormat = [];
                weekDays.forEach((day) => {
                    switch (day) {
                        case 1:
                            weekDaysFormat.push("Lunes");
                            break;
                        case 2:
                            weekDaysFormat.push("Martes");
                            break;
                        case 3:
                            weekDaysFormat.push("Miércoles");
                            break;
                        case 4:
                            weekDaysFormat.push("Jueves");
                            break;
                        case 5:
                            weekDaysFormat.push("Viernes");
                            break;
                        case 6:
                            weekDaysFormat.push("Sábado");
                            break;
                        case 0:
                            weekDaysFormat.push("Domingo");
                    }
                });
                console.log(property.openingHours[0].openingTimes[0]);
                res.render("property/property-details", {
                    property: property,
                    title: `${property.name} | KOKOMO`,
                    openingDay: formatOpening,
                    closingDay: formatClosing,
                    weekDays: weekDaysFormat,
                    openingTime: property.openingHours[0].openingTimes[0].openingTime,
                    closingTime: property.openingHours[0].openingTimes[0].closingTime,
                });
            })
            .catch((error) => {
                console.log("Error: ", error);
            });
    }
};

//Editar Local
exports.editProperty = (req, res, next) => {
    const sessionUser = req.session.currentUser || req.user;
    Property.findById(req.params.id)
        .then((resultado) => {
            console.log(resultado.openingHours[0]);
            res.render("property/edit-property", {
                property: resultado,
                title: `Editar ${resultado.name} | KOKOMO`,
                user: sessionUser,
                weekDays: resultado.openingHours[0].weekDays,
                openingTimes: resultado.openingHours[0].openingTimes[0],
                openingDays: resultado.openingHours[0].openingDays,
            });
        })
        .catch((error) => {
            console.log("Error: ", error);
        });
};

//Guardar cambios del local
exports.saveProperty = (req, res, next) => {
    console.log(req.body);
    const workingDays = [];
    if (req.body.monday) {
        workingDays.push(req.body.monday);
    }
    if (req.body.tuesday) {
        workingDays.push(req.body.tuesday);
    }
    if (req.body.wednesday) {
        workingDays.push(req.body.wednesday);
    }
    if (req.body.thursday) {
        workingDays.push(req.body.thursday);
    }
    if (req.body.friday) {
        workingDays.push(req.body.friday);
    }
    if (req.body.satuday) {
        workingDays.push(req.body.saturday);
    }
    if (req.body.sunday) {
        workingDays.push(req.body.sunday);
    }
    const sessionUser = req.session.currentUser || req.user;
    const dataProperty = {
        owner: sessionUser,
        name: req.body.name,
        description: req.body.description,
        categories: [req.body.categories],
        media: [req.body.media],
        location: {
            name: req.body.ubication,
            lat: req.body.latitude,
            long: req.body.longitude,
        },
        openingHours: [{
            openingDays: {
                openingDay: req.body.opening,
                closingDay: req.body.closing,
            },
            weekDays: workingDays,
            openingTimes: [{
                openingTime: req.body.openhour,
                closingTime: req.body.closehour,
            }, ],
        }, ],
        bookingDuration: req.body.duration,
        availablePlaces: req.body.places,
    };
    if (req.file) {
        dataProperty.mainImage = req.file.path;
    }
    Property.findByIdAndUpdate(req.params.id, dataProperty, {
            new: true,
        })
        .then((property) => {
            createSchedule(property);
            res.render("property/property-details", {
                title: "Local creado | KOKOMO",
                layout: "layout",
                user: sessionUser,
                property,
            });
        })
        .catch((error) => {
            console.log("Error: ", error);
        });
};

//Añadir un favorito
exports.loveProperty = (req, res, next) => {
    Property.findById(req.params.id)
      .then((resultado) => {
        const sessionUser = req.session.currentUser || req.user;
        return Customer.update(
          {
            _id: sessionUser._id,
            favourites: {
              $ne: resultado._id,
            },
          },
          {
            $addToSet: {
              favourites: resultado._id,
            },
          },
          {
            new: true,
          }
        );
      })
      .then((customer) => {
        console.log("Usuario actualizado", customer);
        res.redirect("back");
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  };