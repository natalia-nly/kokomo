const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertySchema = new Schema({
    name: String,
    descriptions: [{
        language: String,
        description: String
    }],
    categories: {
        type: [String],
        enum: ['Chillout', 'Surfer', 'Restaurante', 'Discoteca', 'Bar']
      },
    media:[String],
    location: {
        name: String,
        lat: Number,
        long: Number
    },
    opening_hours:[{
        opening_days:{
            opening_day: Date,
            closing_day: Date
        },
        week_days:[Number],
        opening_times:[
            {
            opening_time: Number,
            closing_time: Number
            }
        ]
    }],
    booking_duration: Number,
    available_places: Number,
    comments: [{
        username: String,
        day: Date,
        comment: String
    }],
    rating: Number,
    bookings: [{type: Schema.Types.ObjectId, ref: "Booking"}]
    },
    {
        timestamps: {
          createdAt: 'createdAt',
          updatedAt: 'updatedAt'
    }
});


const Property = mongoose.model("Property", propertySchema);

module.exports = Property;