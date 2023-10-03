const express = require("express");
const connectToDatabase = require("./database");
const app = express();
connectToDatabase();

app.use(express.json());
app.use("/api", require("./routes/blogs"))
app.use("/auth/Admin", require("./routes/admin"))
app.use("/auth/User", require("./routes/user"))
app.listen(5000, () => {
  console.log("connected to port 5000");
});
