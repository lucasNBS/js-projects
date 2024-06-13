require("dotenv").config();
const exprees = require("express");
const db = require("./db");
const app = exprees();

app.set("view engine", "ejs");
app.use(exprees.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await db.shortUrlSchema.findMany();
  res.render("index", { shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  await db.shortUrlSchema.create({ data: { full: req.body.fullUrl } });

  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = req.params.shortUrl;

  const Url = await db.shortUrlSchema.findFirst({
    where: { short: shortUrl },
  });

  if (Url == null) {
    res.sendStatus(404);
    return;
  }

  await db.shortUrlSchema.update({
    where: { id: Url.id },
    data: { clicks: { increment: 1 } },
  });

  res.redirect(Url.full);
});

app.listen(process.env.PORT);
