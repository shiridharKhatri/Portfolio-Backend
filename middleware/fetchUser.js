const jwt = require("jsonwebtoken");
const JWT_SECRET = "usersecre876tcode*&dasu$&";

const fetchUser = async (req, res, next) => {
  try {
    let token = await req.header("auth-token");
    if (!token) {
      return res
        .status(401)
        .json({
          success: false,
          msg: "Please enter correct token and try again.",
        });
    } else {
      let data = await jwt.verify(token, JWT_SECRET);
      req.user = data.data.user;
    }
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
  next;
};