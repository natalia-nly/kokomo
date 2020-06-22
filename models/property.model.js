const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertySchema = new Schema({
    name: String,
    description: String,
    categories: {
        type: [String],
        enum: ['Chillout', 'Surfer', 'Restaurante', 'Discoteca', 'Bar']
    },
    mainImage: String,
    media: [String],
    location: {
        name: String,
        lat: Number,
        long: Number
    },
    openingHours: [{
         openingDays: {
             openingDay: Date,
            closingDay: Date
        },
       weekDays: [Number],
        openingTimes: [{
            openingTime: Number,
            closingTime: Number
        }]
    }],
    bookingDuration: Number,
    availablePlaces: Number,
    comments: [{
        username: String,
        day: Date,
        comment: String
    }],
    rating: Number,
    bookings: [{bookingId: {
            type: Schema.Types.ObjectId,
            ref: "Booking"
        },
        bookingRef: String
     } ]
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});


const Property = mongoose.model("Property", propertySchema);

module.exports = Property;