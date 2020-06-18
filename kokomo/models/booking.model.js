const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    customer: {type: Schema.Types.ObjectId, ref: "Customer"},
    property: {type: Schema.Types.ObjectId, ref: "Property"},
<<<<<<< HEAD
    booking_ref: String,
    day: Date,
=======
    booking_ref:String,
    day: String,
>>>>>>> 4c82e053af41f860dd027913e9fd77ec47d7bea0
    time: String,
    guests: Number
},
{
        timestamps: {
          createdAt: 'createdAt',
          updatedAt: 'updatedAt'
    }    
});


const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;