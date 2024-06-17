const db = require("../db");
const express = require("express");
const router = express.Router();

router.get("/new", (req, res) => {
  res.render("articles/new");
});

router.get("/edit/:id", async (req, res) => {
  const article = await db.article.findUnique({ where: { id: req.params.id } });
  res.render("articles/edit", { article });
});

router.get("/:slug", async (req, res) => {
  const article = await db.article.findUnique({
    where: { slug: req.params.slug },
  });

  if (article == null) res.redirect("/");

  res.render("articles/show", { article });
});

router.post("/", async (req, res) => {
  let article = {
    title: req.body.title,
    description: req.body?.description,
    markdown: req.body.markdown,
  };

  try {
    article = await db.article.create({ data: article });
    res.redirect(`/articles/${article.slug}`);
  } catch (err) {
    let slugError = false;

    if (err.code === "P2002" && err.meta.target.includes("slug")) {
      slugError = true;
    }

    res.render("articles/new", { article, slugError });
  }
});

router.put("/:id", async (req, res) => {
  let newArticleData;

  try {
    const article = await db.article.findUnique({
      where: { id: req.params.id },
    });

    newArticleData = {
      ...article,
      title: req.body.title,
      description: req.body?.description,
      markdown: req.body.markdown,
    };

    const finalArticle = await db.article.update({
      where: { id: article.id },
      data: newArticleData,
    });

    res.redirect(`/articles/${finalArticle.slug}`);
  } catch (err) {
    let slugError = false;

    if (err.code === "P2002" && err.meta.target.includes("slug")) {
      slugError = true;
    }

    res.render("articles/edit", {
      article: newArticleData,
      slugError,
    });
  }
});

router.delete("/:id", async (req, res) => {
  await db.article.delete({ where: { id: req.params.id } });
  res.redirect("/");
});

module.exports = router;
