require("dotenv").config();

const listEndpoints = require("express-list-endpoints");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

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

app.use( cors({ origin: "http://localhost:3000", credentials: true, }) );
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
const valuesRouter = require("./routes/values.js");
const emailsRouter = require("./routes/emails.js");

app.use("/emails", emailsRouter);
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
app.use("/values", valuesRouter);

//CORS
app.use(cors()); //podemos transformar isto para apenas aceitar pedidos de um determinado URL

//tipo assim:
/*
const corsOptions = {
  origin: "http://localhost:3000", // substituir pelo domínios que queremos que tenham acesso
};
app.use(cors(corsOptions));
*/

console.log(listEndpoints(app));
