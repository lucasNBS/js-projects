const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/", (req, res) => {
  db.pool.query("SELECT * FROM Subscriber ORDER BY id ASC", (err, result) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }

    res.status(200).json(result.rows);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.pool.query(
    "SELECT * FROM Subscriber WHERE id = $1",
    [id],
    (err, result) => {
      if (err) {
        res.status(404).send({ message: err.message });
        return;
      }

      res.status(200).json(result.rows);
    }
  );
});

router.post("/", (req, res) => {
  const { name, subscriberToChannel } = req.body;

  db.pool.query(
    `INSERT INTO Subscriber (name, subscriberToChannel) VALUES ($1, $2) RETURNING *`,
    [name, subscriberToChannel],
    (err, result) => {
      if (err) {
        res.status(401).send({ message: err.message });
        return;
      }

      res.status(201).json(result.rows[0]);
    }
  );
});

router.patch("/:id", (req, res) => {
  const { id } = req.params;

  const { name, subscriberToChannel } = req.body;

  let strings = [];
  let data = [];

  let nameString = "";
  if (name) {
    nameString = `name = $${data.length + 1}`;
    data.push(name);
    strings.push(nameString);
  }

  let subscriberToChannelString = "";
  if (subscriberToChannel) {
    subscriberToChannelString = `subscriberToChannel = $${data.length + 1}`;
    data.push(subscriberToChannel);
    strings.push(subscriberToChannelString);
  }

  const finalString = strings.join(", ");

  data.push(id);

  db.pool.query(
    `UPDATE Subscriber SET ${finalString} WHERE id = $${data.length}`,
    data,
    (err, result) => {
      if (err) {
        res.status(400).send({ message: err.message });
        return;
      }

      res.status(200).json(result.rows.filter((row) => row.id === id));
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.pool.query("DELETE FROM Subscriber WHERE id = $1", [id], (err, result) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }

    res.status(200).send({ message: "Subscriber deleted" });
  });
});

module.exports = router;
