const express = require("express");
const db = require("./db");
const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const code = "Welcome to HasteBin";

  res.render("code-display", { code, language: "plaintext" });
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/save", async (req, res) => {
  const { value } = req.body;

  try {
    const document = await db.document.create({ data: { value } });
    res.redirect(`/${document.id}`);
  } catch (err) {
    res.render("new", { value });
  }
});

app.get("/:id/duplicate", async (req, res) => {
  const id = req.params.id;

  try {
    const document = await db.document.findUnique({
      where: { id: Number(id) },
    });
    res.render("new", { value: document.value });
  } catch (err) {
    res.redirect(`/${id}`);
  }
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const document = await db.document.findUnique({
      where: { id: Number(id) },
    });
    res.render("code-display", { code: document.value, id: id });
  } catch (err) {
    res.redirect("/");
  }
});

app.listen(3000);
