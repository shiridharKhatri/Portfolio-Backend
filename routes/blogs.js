const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Blogs = require("../models/Blogs");
router.post(
  "/blog/post",
  [
    body("title").isLength({ min: 15 }),
    body("description").isLength({ min: 25 }),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res
        .status(406)
        .json({ status: 406, success: false, errors: error.array() });
    }
    try {
      const { title, description } = req.body;
      await Blogs.create({
        title,
        description,
      });
      res.send({ success: true, msg: "Posted successfully!" });
    } catch (error) {
      return res.status(400).json({ success: false, msg: error.message });
    }
  }
);

router.get("/blog/fetch", async (req, res) => {
  try {
    const blogs = await Blogs.find();
    if (!blogs) {
      return res.status(404).json({ success: false, msg: "Blogs not found" });
    } else {
      return res.status(200).json({ success: true, data: blogs });
    }
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});

router.put("/blog/edit/:id", async(req,res)=>{
  try {
    
  } catch (error) {
    
  }
})
module.exports = router;
