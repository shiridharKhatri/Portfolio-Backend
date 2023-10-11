const express = require("express");
const Projects = require("../models/Projects");
const fetchAdmin = require("../middleware/fetchAdmin");
const router = express.Router();
const multer = require("multer");
const moment = require("moment");
const fs = require("fs");
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
      const { title, description, technology } = req.body;
      const images = req.files.map((file) => file.filename);
      await Projects.create({
        title,
        description,
        technology,
        image: images,
        admin: req.admin.id,
      });
      res
        .status(200)
        .json({ success: true, msg: "Project uploaded successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, msg: error.message });
    }
  }
);
router.get("/fetch", async (req, res) => {
  try {
    let project = await Projects.find();
    if (!project) {
      return res
        .status(404)
        .json({ success: false, msg: "No projects found!" });
    } else {
      return res
        .status(200)
        .json({ success: true, total: project.length, project });
    }
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});
router.put("/edit/:id", fetchAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;
    let project = await Projects.findById(req.params.id);
    let newProject = {};
    if (title) {
      newProject.title = title;
    }
    if (description) {
      newProject.description = description;
    }
    if (req.admin.id.toString() !== project.admin.toString()) {
      return res.status(401).json({
        success: false,
        msg: "You do not have the authority to edit this project",
      });
    } else {
      await Projects.findByIdAndUpdate(
        req.params.id,
        { $set: newProject },
        { new: true }
      );
      res
        .status(200)
        .json({ success: true, msg: "Project edited successfully" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});
router.delete("/delete/:id", fetchAdmin, async (req, res) => {
  try {
    const project = await Projects.findById(req.params.id);
    if (req.admin.id.toString() !== project.admin.toString()) {
      return res.status(401).json({
        success: false,
        msg: "You have to authority to delete this project",
      });
    } else {
      const filePath = `./blog-image/${project.image.map((e) => e)}`;
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting the file:", err);
          } else {
            console.log("File deleted successfully.");
          }
        });
      } else {
        console.log("File not found.");
      }
    }
    await Projects.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, msg: "Project Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    let query = req.query.q;
    let result = await Projects.find({ $text: { $search: query } });
    if (!result || result.length <= 0) {
      return res.status(404).json({ success: false, msg: "No result found!" });
    } else {
      return res
        .status(200)
        .json({ success: true, total: result.length, query: query, result });
    }
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});
module.exports = router;
