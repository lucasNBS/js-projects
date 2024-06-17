const methodOverride = require("method-override");
const express = require("express");
const app = express();

const articlesRouter = require("./routes/articles");
const db = require("./db");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.use("/articles", articlesRouter);

app.get("/", async (req, res) => {
  const articles = await db.article.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.render("articles/index", { articles });
});

app.listen(8000);
