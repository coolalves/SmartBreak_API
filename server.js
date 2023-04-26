require("dotenv").config();

const listEndpoints = require("express-list-endpoints");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to Database");
    app.listen(process.env.PORT, () => {
      console.log("Server Started");
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.use(express.json());

const usersRouter = require("./routes/users.js");
const tipsRouter = require("./routes/tips.js");
const goalsRouter = require("./routes/goals.js");
const departmentsRouter = require("./routes/departments.js");
const metricsRouter = require("./routes/metrics.js");
const rewardsRouter = require("./routes/rewards.js");
const organizationsRouter = require("./routes/organizations.js");
const pausesRouter = require("./routes/pauses.js");
const devicesRouter = require("./routes/devices.js");
const routinesRouter = require("./routes/routines.js");
const authRouter = require("./routes/auth.js");

app.use("/users", usersRouter);
app.use("/tips", tipsRouter);
app.use("/goals", goalsRouter);
app.use("/departments", departmentsRouter);
app.use("/metrics", metricsRouter);
app.use("/rewards", rewardsRouter);
app.use("/organizations", organizationsRouter);
app.use("/pauses", pausesRouter);
app.use("/devices", devicesRouter);
app.use("/routines", routinesRouter);
app.use("/auth", authRouter);

console.log(listEndpoints(app));
