// app.js - minimal Express app wrapper (created by assistant)
require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// if views folder exists, set view engine to ejs
const fs = require('fs');
if (fs.existsSync(path.join(__dirname, 'views'))) {
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
}

// simple health route
app.get('/ping', (req, res) => res.send('pong'));

module.exports = app;
