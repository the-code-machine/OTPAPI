const mongoose= require ('mongoose');
const dotenv = require('dotenv');
const DB_URI = dotenv.config().parsed.DB_URI;

module.exports={
    DB: DB_URI
};

