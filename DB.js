const mongoose= require ('mongoose');
const dotenv = require('dotenv');
const DB_URI = process.env.DB_URI;

module.exports={
    DB: DB_URI
};

