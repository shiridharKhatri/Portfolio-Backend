const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config({path:"./config.env"});
const url = process.env.DATABASE;
const connectToDatabase = () => {
  mongoose
    .connect(url)
    .then(() => {
      console.log("Connect to database successfully");
    })
    .catch((error) => {
      console.log(`Failed to connect with database reason : ${error}`);
    });
};
module.exports = connectToDatabase;
