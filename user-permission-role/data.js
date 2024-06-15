const ROLES = {
  ADMIN: "admin",
  BASIC: "basic",
};

module.exports = {
  ROLES: ROLES,
  users: [
    { id: 1, name: "John Doe", role: ROLES.ADMIN },
    { id: 2, name: "Jane Doe", role: ROLES.BASIC },
    { id: 3, name: "Jack Doe", role: ROLES.BASIC },
  ],
  posts: [
    { id: 1, userId: 1, name: "John's post" },
    { id: 2, userId: 2, name: "Jane's post" },
    { id: 3, userId: 3, name: "Jack's post" },
  ],
};
