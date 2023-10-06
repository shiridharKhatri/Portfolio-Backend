const express = require("express");
const connectToDatabase = require("./database");
const app = express();
connectToDatabase();

app.use(express.json());
app.use("/api", require("./routes/blogs"));
app.use("/api/project", require("./routes/projects"));
app.use("/auth/Admin", require("./routes/admin"));
app.use("/auth/User", require("./routes/user"));
app.use("/blogImage", express.static("./blog-image"));
app.use("/projectImage", express.static("./project-image"));
app.listen(5000, () => {
  console.log("connected to port 5000");
});
