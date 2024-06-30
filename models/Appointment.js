const mongoose = require("../db/conn");
const { Schema } = mongoose;

const Appointment = mongoose.model(
  "Appointment",
  new Schema(
    {
      date: {
        type: Date,
        required: true,
      },
      time: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["scheduled", "completed", "canceled"],
        default: "scheduled",
      },
      doctor: Object,
      patient: Object,
    },
    { timestamps: true }
  )
);

module.exports = Appointment;
