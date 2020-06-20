const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    customer: {type: Schema.Types.ObjectId, ref: "Customer"},
    property: {type: Schema.Types.ObjectId, ref: "Property"},
    booking_ref:String,
    day: String,
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