const mongoose = require("mongoose");
const adminSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    default: "Shiridhar Khatri",
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  confirm_password: {
    type: String,
    require: true,
  },
});
module.exports = mongoose.model("Admin-Data", adminSchema);