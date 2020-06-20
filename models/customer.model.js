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
    //Número de teléfono del cliente
    telNumber:{
      type: Number
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
    bookings: [{
      id: {
        type: Schema.Types.ObjectId,
        ref: "Booking"
      },
      booking_ref: String,
      property: String,
      day: String,
      time: String,
      guests: Number
    }],
    //favoritos
    favourites: [{
      type: Schema.Types.ObjectId,
      ref: "Property"
    }],
    // boolean para saber si es owner
    owner: {
      type: Boolean,
      default: false
    },
    // lista de sus locales
    ownProperties: [{
      type: Schema.Types.ObjectId,
      ref: "Property"
    }]
  },

  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  });


const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;