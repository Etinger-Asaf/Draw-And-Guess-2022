const express = require("express");
const cors = require("cors");
const gameRouter = require("./routes/gameRoutes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1", gameRouter);

module.exports = app;
