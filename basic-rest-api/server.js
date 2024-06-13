const express = require("express");
const app = express();

const db = require("./db");

db.createTable();

app.use(express.json());

const subscribersRouter = require("./routes/subscribers");
app.use("/subscribers", subscribersRouter);

app.listen(8000, () => {
  console.log("Server is listening on port 8000");
});
