const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    property: {type: Schema.Types.ObjectId, ref: "Property"},
    time_boxes: [{
		start_time: Date,
		end_time: Date,
		status: Boolean,
		remaining: Number,
        total: Number,
        bookings: [{type: Schema.Types.ObjectId, ref: "Booking"}]
	}]
},
{
    timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
    }    
});


const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;