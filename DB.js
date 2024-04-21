const mongoose= require ('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const DB_URI = process.env.DB_URI;

module.exports={
    DB: DB_URI
};

