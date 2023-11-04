const express = require("express");
const fetchAdmin = require("../middleware/fetchAdmin");
const FreeCode = require("../models/FreeCode");
const router = express.Router();
const multer = require("multer");
const moment = require('moment')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./free-code-image");
  },
  filename: function (req, file, cb) {
    cb(null, moment().format("MMM Do YY") + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post(
  "/post",
  fetchAdmin,
  upload.single("code-img"),
  async (req, res) => {
    try {
      const { title, description, color, link, live } = req.body;
      await FreeCode.create({
        title,
        description,
        color,
        link,
        live,
        image: req.file.filename,
      });
      res.status(200).json({ success: true, msg: "Posted successfully!" });
    } catch (error) {
      return res.status(500).json({ success: false, msg: error.message });
    }
  }
);

router.get("/fetch", async (req, res) => {
  try {
    let codes = await FreeCode.find();
    if (!codes) {
      return res
        .status(404)
        .json({ success: false, msg: "Projects not found!" });
    } else {
      return res.status(200).json({ success: true,total: codes.length, codes });
    }
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});
module.exports = router;
