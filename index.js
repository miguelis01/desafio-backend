const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use(express.static("public"));

//Routes
const UserRoutes = require("./routes/UserRoutes");
const AppointmentRoutes = require("./routes/AppointmentRoutes");

app.use("/users", UserRoutes);
app.use("/appointments", AppointmentRoutes);

app.listen(5000);
