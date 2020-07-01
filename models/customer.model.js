const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const deepPopulate = require('mongoose-deep-populate')(mongoose);
// const options = {};


const customerSchema = new Schema({
    //Username del cliente
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    //Número de teléfono del cliente
    telNumber: {
      type: Number
    },
    //email del cliente
    email: {
      type: String,
      trim: true,
      required: [true, 'Email is required.'],
      unique: true
    },
    //GOOGLE Id
    googleID: String,
    //password del cliente
    passwordHash: {
      type: String
    },
    //avatar
    avatar: {
      type: String,
      default: "https://i.ya-webdesign.com/images/avatar-icon-png-5.png"
    },
    //reservas del cliente
    bookings: [{
      type: Schema.Types.ObjectId,
      ref: "Booking"
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
    }],
  },

  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  });


const Customer = mongoose.model("Customer", customerSchema);
//Customer.plugin(deepPopulate, options);

module.exports = Customer;