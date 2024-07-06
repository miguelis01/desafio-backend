const jwt = require("jsonwebtoken");
const Token = require("../models/Token");

const createAppointmentToken = async (appointmentId) => {
  const token = jwt.sign({ appointmentId }, "appointmentsecret");
  const novoToken = new Token({ token, appointmentId });
  await novoToken.save();
  return token;
};

module.exports = createAppointmentToken;
