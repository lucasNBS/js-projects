const multer = require("multer");
const bcrypt = require("bcrypt");
const express = require("express");
const db = require("./db");
const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  dest: "uploads",
});

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname,
  };

  if (req.body.password != null && req.body.password !== "") {
    fileData.password = await bcrypt.hash(req.body.password, 10);
  }

  const file = await db.file.create({ data: fileData });

  res.render("index", { fileLink: `${req.headers.origin}/file/${file.id}` });
});

app.get("/file/:id", handleDownload);

app.post("/file/:id", handleDownload);

async function handleDownload(req, res) {
  const file = await db.file.findUnique({
    where: { id: req.params.id },
  });

  if (file == null) {
    res.redirect("/");
    return;
  }

  if (file.password != null) {
    if (req.body.password == null) {
      res.render("password");
      return;
    }

    const isCorrect = await bcrypt.compare(req.body.password, file.password);

    if (!isCorrect) {
      res.render("password", { error: true });
      return;
    }
  }

  res.download(file.path, file.originalName);
  await db.file.update({
    where: { id: req.params.id },
    data: { downloadCount: { increment: 1 } },
  });
}

app.listen(8000);
