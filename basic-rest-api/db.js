require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function createTable() {
  pool.query(
    "CREATE TABLE IF NOT EXISTS Subscriber(id SERIAL PRIMARY KEY NOT NULL, name VARCHAR(50) NOT NULL, subscriberToChannel VARCHAR(100) NOT NULL, subscribeDate DATE DEFAULT CURRENT_DATE)",
    (err, res) => {
      console.log(err, res);
    }
  );
}

module.exports = {
  pool,
  createTable,
};
