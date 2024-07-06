const mongoose = require("../db/conn");
const { Schema } = mongoose;

const Token = mongoose.model(
  "Token",
  new Schema({
    token: String,
    appointmentId: String,
    used: { type: Boolean, default: false },
  })
);

module.exports = Token;
