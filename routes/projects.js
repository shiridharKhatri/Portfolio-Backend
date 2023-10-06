const express = require("express");
const Projects = require("../models/Projects");
const fetchAdmin = require("../middleware/fetchAdmin");
const router = express.Router();
const multer = require("multer");
const moment = require("moment");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./project-image");
  },
  filename: function (req, file, cb) {
    cb(null, moment().format("MMM Do YY") + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post(
  "/post",
  fetchAdmin,
  upload.array("project-image", 10),
  async (req, res) => {
    try {
      const { title, description, technology, image } = req.body;
      const images = req.files.map((file) => file.filename);
      await Projects.create({
        title,
        description,
        technology,
        image: images,
        admin:req.admin.id
      });
      res
        .status(200)
        .json({ success: true, msg: "Project uploaded successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, msg: error.message });
    }
  }
);

module.exports = router;
