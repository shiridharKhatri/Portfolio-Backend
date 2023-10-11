const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const forgetPassword = require("../mail/forgetPassword");
const router = express.Router();
const JWT_SECRET = "usersecre876tcode*&dasu$&";

router.post(
  "/signup",
  [
    body("name").isLength({ min: 3 }),
    body("email").isLength({ min: 5 }),
    body("password").isStrongPassword(),
    body("gender").isLength({ min: 3 }),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(406).json({ sucess: false, error: error.array() });
    }
    try {
      const { name, email, password, gender } = req.body;
      let user = await User.findOne({ email: email });
      if (user) {
        return res
          .status(401)
          .json({ success: false, msg: "User with this email already exist" });
      } else {
        const salt = await bcrypt.genSalt(10);
        const secPas = await bcrypt.hash(password, salt);
        user = await User.create({
          name,
          email,
          password: secPas,
          gender,
        });
        res
          .status(200)
          .json({ success: true, msg: "Account created successfully" });
      }
    } catch (error) {
      return res.status(500).json({ success: false, msg: error.message });
    }
  }
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(406).json({ success: false, error: error.array() });
    }
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(401).json({
          success: false,
          msg: "No user found with given email! Please recheck and try again.",
        });
      }
      let comparePas = await bcrypt.compare(password, user.password);
      if (!comparePas) {
        return res
          .status(401)
          .json({ success: false, msg: "You have entered wrong password!" });
      } else {
        let data = {
          user: {
            id: user.id,
          },
        };
        let expDate = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;
        const token = jwt.sign({ data, exp: expDate }, JWT_SECRET);
        res.status(200).json({
          success: true,
          msg: `Welcome back ${user.name}`,
          token: token,
        });
      }
    } catch (error) {
      return res.status(500).json({ success: false, msg: error.message });
    }
  }
);

router.post("/forgetPasswordEmailValidation", async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, msg: "User with given email doesn't exist!" });
    } else {
      function generateRandomCode(count) {
        let code = "";
        for (let i = 0; i < count; i++) {
          const randomNumber = Math.floor(Math.random() * 10); // Generate a random digit between 0 and 9
          code += randomNumber;
        }
        return code;
      }

      let code = generateRandomCode(6);
      await forgetPassword(user.email, user.name, code);
      await User.findByIdAndUpdate(
        user._id,
        { $set: { forgetPasswordCode: code } },
        { new: true }
      );

      res.json({
        success: true,
        msg: "Forget password code sent successfully!",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

module.exports = router;
