require("dotenv").config();
const express = require("express");
const app = express();

const data = require("./data");

const jwt = require("jsonwebtoken");

app.use(express.json());

let refreshTokensList = [];

app.get("/posts", authenticateToken, (req, res) => {
  res.json(data.filter((data) => data.username === req.user.username));
});

app.post("/token", (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokensList.includes(refreshToken)) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = generateAccessToken({ username: user.username });
    res.json({ accessToken });
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { username };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokensList.push(refreshToken);

  res.json({ accessToken, refreshToken });
});

app.delete("/logout", (req, res) => {
  refreshTokensList = refreshTokensList.filter(
    (token) => token != req.body.refreshToken
  );
  res.sendStatus(204);
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

app.listen(8000);
