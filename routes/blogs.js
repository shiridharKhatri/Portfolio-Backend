const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Blogs = require("../models/Blogs");
const fetchAdmin = require("../middleware/fetchAdmin");

// Endpoint to post a new blog
router.post(
  "/blog/post",
  [
    body("title").isLength({ min: 15 }),
    body("description").isLength({ min: 25 }),
  ],
  fetchAdmin,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(406)
        .json({ status: 406, success: false, errors: errors.array() });
    }

    try {
      const { title, description } = req.body;
      await Blogs.create({
        title,
        description,
        admin: req.admin.id,
      });
      res.json({ success: true, msg: "Blog posted successfully!" });
    } catch (error) {
      return res.status(400).json({ success: false, msg: error.message });
    }
  }
);

// Endpoint to fetch all blogs
router.get("/blog/fetch", async (req, res) => {
  try {
    const blogs = await Blogs.find();

    if (!blogs) {
      return res.status(404).json({ success: false, msg: "Blogs not found" });
    } else {
      return res
        .status(200)
        .json({ success: true, total: blogs.length, data: blogs });
    }
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});

// Endpoint to edit a blog
router.put("/blog/edit/:id", fetchAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;
    const newBlog = {};

    if (title) {
      newBlog.title = title;
    }

    if (description) {
      newBlog.description = description;
    }

    let blog = await Blogs.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, msg: "Blog not found" });
    }

    if (blog.admin.toString() !== req.admin.id.toString()) {
      return res.status(401).json({
        success: false,
        msg: "You do not have the authority to edit this blog.",
      });
    } else {
      await Blogs.findByIdAndUpdate(
        req.params.id,
        { $set: newBlog },
        { new: true }
      );
      res.status(200).json({ success: true, msg: "Blog edited successfully" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

// Endpoint to delete a blog
router.delete("/blog/delete/:id", fetchAdmin, async (req, res) => {
  try {
    const blog = await Blogs.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, msg: "Blog not found" });
    }

    if (blog.admin.toString() !== req.admin.id.toString()) {
      return res.status(401).json({
        success: false,
        msg: "You do not have the authority to delete this blog.",
      });
    } else {
      await Blogs.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, msg: "Blog deleted successfully" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});


// Endpoint to search a blog
router.get("/blog/search", async (req, res) => {
  try {
    let query = req.query.q;
    let result = await Blogs.find({ $text: { $search: query } });
    if (!result || result.length <= 0 ) {
      return res.status(404).json({
        success: false,
        total: result.length,
        query: query,
        msg: "No result found",
      });
    } else {
      return res.status(200).json({
        success: true,
        total: result.length,
        query: query,
        result
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});
module.exports = router;
