const mongoose = require("mongoose");
const projectSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  technology: {
    type: [String],
  },
  image: {
    type: [String],
  },
});
projectSchema.index({ title: "text", description: "title" });
module.exports = mongoose.model("Projects", projectSchema);