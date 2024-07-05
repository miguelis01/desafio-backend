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
      description: {
        type: String,
        required: true,
      },
      user: Object,
    },
    { timestamps: true }
  )
);

module.exports = Appointment;
