const createAppointmentToken = require("../helpers/create-appointment-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
const Appointment = require("../models/Appointment");
const Token = require("../models/Token");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongoose").Types.ObjectId;
const generatePdf = require("../helpers/generate-pdf");

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

      generatePdf(newAppointment);

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

  static async createLink(req, res) {
    const appointmentId = req.params.appointmentId;
    const token = await createAppointmentToken(appointmentId);
    const link = `http://localhost:5000/appointments/getappointment/${token}`;
    res.send({ link });
    return;
  }

  static async getAppointment(req, res) {
    const token = req.params.token;

    try {
      const decoded = jwt.verify(token, "appointmentsecret");
      const appointmentId = decoded.appointmentId;

      // Verificar se o token está no banco de dados e não foi usado
      const tokenRecord = await Token.findOne({ token: token });
      if (!tokenRecord || tokenRecord.used) {
        res.status(400).send({ mensagem: "Token inválido ou já usado" });
        return;
      }

      // Marcar o token como usado
      tokenRecord.used = true;
      await tokenRecord.save();

      const consulta = await Appointment.findOne({ _id: appointmentId });
      if (consulta) {
        res.send({ consulta });
        return;
      } else {
        res.status(404).send({ mensagem: "Consulta não encontrada" });
        return;
      }
    } catch (err) {
      res.status(400).send({ mensagem: "Token inválido ou expirado" });
      return;
    }
  }

  static async delete(req, res) {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "ID invalido" });
      return;
    }

    const appointment = await Appointment.findOne({ _id: id });
    if (!appointment) {
      res.status(404).json({ message: "Consulta não encontrada" });
      return;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);

    if (appointment.user._id.toString() !== user.id.toString()) {
      res
        .status(422)
        .json({ message: "Consulta não pertence a usuario cadastrado" });
      return;
    }

    await Appointment.findByIdAndDelete(id);

    res.status(200).json({ message: "Consulta deletada" });
  }

  static async update(req, res) {
    const id = req.params.id;
    const { date, time, description } = req.body;

    const updatedData = {};

    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "ID invalido" });
      return;
    }

    const appointment = await Appointment.findOne({ _id: id });
    if (!appointment) {
      res.status(404).json({ message: "Consulta não encontrada" });
      return;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);

    if (appointment.user._id.toString() !== user.id.toString()) {
      res
        .status(422)
        .json({ message: "Consulta não pertence a usuario cadastrado" });
      return;
    }

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

    updatedData.date = date;
    updatedData.time = time;
    updatedData.description = description;

    const dateTimeExists = await Appointment.findOne({
      date: date,
      time: time,
    });

    if (dateTimeExists && dateTimeExists._id.toString() !== id) {
      res.status(422).json({ message: "Já existe uma consulta nesse horário" });
      return;
    }

    await Appointment.findByIdAndUpdate(id, updatedData);

    res.status(200).json({ message: "Atualizado com sucesso" });
  }
};
