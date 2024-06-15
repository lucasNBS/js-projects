const { ROLES } = require("./data");

function canViewPost(user, post) {
  return user.role === ROLES.ADMIN || user.id === post.userId;
}

function scopedPosts(user, posts) {
  if (user.role === ROLES.ADMIN) return posts;
  return posts.filter((post) => post.userId === user.id);
}

module.exports = {
  canViewPost,
  scopedPosts,
};
