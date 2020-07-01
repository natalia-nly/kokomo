const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    property: {
        type: Schema.Types.ObjectId,
        ref: "Property"
    },
    timeBoxes: [{
        day: Date,
        startTime: String,
        endTime: Number,
        status: Boolean,
        remaining: Number,
        total: Number
    }]
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});


const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;