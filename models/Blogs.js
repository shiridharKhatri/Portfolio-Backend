const mongoose = require("mongoose");
const blogSchema = mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin-Data",
  },
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  img: {
    type: String,
  },
});
blogSchema.index({ title: "text", description: "text" });
module.exports = mongoose.model("Blogs", blogSchema);
