const Appointment = require("../models/Appointment");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const { format } = require("date-fns");
const { ptBR } = require("date-fns/locale");

const generatePdf = (Appointment) => {
  // Formatar a data
  const formattedDate = format(
    new Date(Appointment.date),
    "dd 'de' MMMM 'de' yyyy",
    { locale: ptBR }
  );

  // Gerar o PDF
  const doc = new PDFDocument();
  const filePath = `./pdfs/appointment_${Appointment._id}.pdf`;

  // Criar diretório se não existir
  if (!fs.existsSync("./pdfs")) {
    fs.mkdirSync("./pdfs");
  }

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(25).text("Detalhes da Consulta", {
    align: "center",
  });

  doc.moveDown();

  doc.fontSize(16).text(`Paciente: ${Appointment.user.name}`);
  doc.fontSize(16).text(`Data: ${formattedDate}`);
  doc.fontSize(16).text(`Hora: ${Appointment.time}`);
  doc.fontSize(16).text(`Descrição: ${Appointment.description}`);

  doc.end();
};

module.exports = generatePdf;
