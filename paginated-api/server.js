const express = require("express");
const app = express();
const data = require("./data");

app.get("/", paginate(data), (req, res) => {
  res.json(res.paginatedResults);
});

function paginate(data) {
  return (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const initialIndex = (page - 1) * limit;
    const finalIndex = page * limit;

    let results = {};

    if (initialIndex > 0) {
      results.previous = `http://localhost:8000/?page=${
        page - 1
      }&limit=${limit}`;
    }

    if (finalIndex < data.length) {
      results.next = `http://localhost:8000/?page=${page + 1}&limit=${limit}`;
    }

    results.results = data.slice(initialIndex, finalIndex);

    res.paginatedResults = results;

    next();
  };
}

app.listen(8000);
