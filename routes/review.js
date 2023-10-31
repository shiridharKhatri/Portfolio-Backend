const express = require("express");
const Review = require("../models/Review");
const fetchUser = require("../middleware/fetchUser");
const User = require("../models/User");
const router = express.Router();
router.post(
  "/postReview",
  fetchUser,
  async (req, res) => {
    try {
      const { review, star, display_name, img } = req.body;
      let user = await User.findById(req.user.id);
      await Review.create({
        review,
        star,
        display_name,
        reviewBy: user.name,
        img,
      });
      return res
        .status(200)
        .json({ success: true, msg: "Review added successfully!" });
    } catch (error) {
      return res.status(500).json({ success: false, msg: error.message });
    }
  }
);

router.get("/fetch", async (req, res) => {
  try {
    let review = await Review.find();
    if (!review) {
      return res.status(404).json({ success: false, msg: "No review found" });
    } else {
      return res
        .status(200)
        .json({ success: true, total: review.length, review });
    }
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});
module.exports = router;
