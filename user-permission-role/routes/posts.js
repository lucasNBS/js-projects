const express = require("express");
const router = express.Router();

const data = require("../data");
const { authUser } = require("../auth");
const { canViewPost, scopedPosts } = require("../permissions");

router.get("/", authUser, (req, res) => {
  res.json(scopedPosts(req.user, data.posts));
});

router.get("/:postId", setPost, authUser, getPost, (req, res) => {
  res.json(req.post);
});

function setPost(req, res, next) {
  const postId = parseInt(req.params.postId);

  req.post = data.posts.find((post) => post.id === postId);

  if (req.post == null) {
    res.status(404);
    return res.send("Not Found");
  }

  next();
}

function getPost(req, res, next) {
  if (!canViewPost(req.user, req.post)) {
    res.status(401);
    return res.send("Not Allowed");
  }

  next();
}

module.exports = router;
