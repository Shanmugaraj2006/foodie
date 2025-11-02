// db.js - singleton sqlite3 DB connection
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open SQLite DB at', dbPath, err.message);
    process.exit(1);
  } else {
    console.log('Connected to SQLite DB at', dbPath);
  }
});

module.exports = db;
