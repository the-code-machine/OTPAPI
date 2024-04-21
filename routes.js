
const express = require("express");
const Router = express.Router();
const bodyParser = require('body-parser');
const otpcontroler= require('./controller');
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


Router.post('/otp', otpcontroler.genrateotp);
Router.post('/resetotp', otpcontroler.genrateResetotp);
Router.post('/verifyotp',otpcontroler.verifyotp);

module.exports = Router;
