const express = require("express");
const Admin = require("../models/Admin");
const router = express.Router();
const { body, validationResult } = require("express-validator");

router.post(
  "/signup",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isStrongPassword(),
    body("confirm_password").isStrongPassword(),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res
        .status(406)
        .json({ status: 406, success: false, errors: error.array() });
    }
    try {
      const { name, email, password, confirm_password } = req.body;
      const adminInfo = await Admin.findOne({ email: email });
      let admin = await Admin.find();
      if (password === confirm_password && !adminInfo) {
        admin = await Admin.create({ name, email, password, confirm_password });
        res
          .status(200)
          .json({ success: true, msg: "Admin created successfully" });
      } else if (adminInfo) {
        return res
          .status(400)
          .json({
            success: false,
            data: !admin,
            msg: "Admin with this email already exist",
          });
      }else if(password !== confirm_password){
        return res
          .status(400)
          .json({
            success: false,
            msg: "Confirm password must be same as password",
          });
      }
    } catch (error) {
      return res.status(400).json({ success: false, msg: error.message });
    }
  }
);
module.exports = router;
