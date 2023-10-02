const mongoose = require("mongoose");
const connectToDatabase = () => {
  let url =
    "mongodb+srv://khatrishiridhar:Aisha976@cluster0.xyncmbu.mongodb.net/Portfolio_data";
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
