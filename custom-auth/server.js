const express = require("express");
const bcrypt = require("bcrypt");
const app = express();

const users = [];

app.use(express.json());

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = {
      name: req.body.name,
      password: hashedPassword,
    };

    users.push(user);

    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500);
  }
});

app.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.name === req.body.name);

  if (!user) {
    return res.sendStatus(404);
  }

  try {
    const isValid = await bcrypt.compare(req.body.password, user.password);

    if (isValid) {
      res.send("Success");
    } else {
      res.status(401).send("Invalid Password");
    }
  } catch (err) {
    res.sendStatus(500);
  }
});

app.listen(8000);
