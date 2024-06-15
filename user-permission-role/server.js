const express = require("express");
const app = express();

const { authUser, authRole } = require("./auth");
const data = require("./data");
const router = require("./routes/posts");

app.use(express.json());
app.use(setUser);
app.use("/posts", router);

app.get("/", (req, res) => {
  res.send("Home page");
});

app.get("/dashboard", authUser, (req, res) => {
  res.send("Dashboard page");
});

app.get("/admin", authUser, authRole(data.ROLES.ADMIN), (req, res) => {
  res.send("Admin page");
});

function setUser(req, res, next) {
  const userId = req.body?.userId;

  if (userId) {
    req.user = data.users.find((user) => user.id === userId);
  }

  next();
}

app.listen(8000);
