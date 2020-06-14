const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    //Username del cliente
    username: {
        type: String,
        trim: true,
        required: [true, 'Username is required.'],
        unique: true
      },
    //email del cliente
    email: {
        type: String,
        trim: true,
        required: [true, 'Email is required.'],
        unique: true
    },
    //password del cliente
    passwordHash: {
        type: String,
        required: [true, 'Password is required.']
      },
    //reservas del cliente
    bookings: [{type: Schema.Types.ObjectId, ref: "Booking"}]
    }, 
    {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }});


const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;