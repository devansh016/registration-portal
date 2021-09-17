const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

require('dotenv').config();
require('./util/database');

// Extracts Body in HTTP requests
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// Serving static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Payment Route
const paymentRoute = require('./routes/paymentRoute')
app.use('/', paymentRoute);

// Starting the server
app.listen(process.env.PORT || 80);
console.log('Server is running.')