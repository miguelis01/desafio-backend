const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
const Appointment = require("../models/Appointment");

module.exports = class AppointmentController {
  static async create(req, res) {
    const { date, time, description } = req.body;

    if (!date) {
      res.status(422).json({ message: "A data é obrigatoria" });
      return;
    }

    if (!time) {
      res.status(422).json({ message: "O horário é obrigatorio" });
      return;
    }

    if (!description) {
      res.status(422).json({ message: "A descrição é obrigatoria" });
      return;
    }

    const dateTimeExists = await Appointment.findOne({
      date: date,
      time: time,
    });

    if (dateTimeExists) {
      res.status(422).json({ message: "Já existe uma consulta nesse horário" });
      return;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);

    const appointment = new Appointment({
      time,
      date,
      description,
      user: {
        _id: user._id,
        name: user.name,
      },
    });

    try {
      const newAppointment = await appointment.save();
      res.status(201).json({ message: "cadastrado", newAppointment });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async getAllUserAppointments(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const appointments = await Appointment.find({ "user._id": user._id }).sort(
      "-createdAt"
    );

    res.status(200).json({
      appointments,
    });
  }
};
