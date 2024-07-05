const router = require("express").Router();

const AppointmentController = require("../controllers/AppointmentController");

// middleware
const verifyToken = require("../helpers/verify-token");

router.post("/create", verifyToken, AppointmentController.create);
router.get(
  "/myappointments",
  verifyToken,
  AppointmentController.getAllUserAppointments
);

module.exports = router;
