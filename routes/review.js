const express = require("express");
const Review = require("../models/Review");
const fetchUser = require("../middleware/fetchUser");
const User = require("../models/User");
const router = express.Router();
const multer = require("multer");
const moment = require("moment");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./review-image");
  },
  filename: function (req, file, cb) {
    cb(null, moment().format("MMM-Do-YY") + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const { Octokit } = require("@octokit/core");
const octokit = new Octokit({
  auth: "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",
}); // Replace with your GitHub personal access token

router.post(
  "/postReview",
  upload.single("review-img"),
  fetchUser,
  async (req, res) => {
    try {
      const { review, star, display_name } = req.body;
      let user = await User.findById(req.user.id);

      await Review.create({
        review,
        star,
        display_name,
        reviewBy: user.name,
        img: req.file.filename,
      });

      const owner = "shiridharKhatri"; // Your GitHub username
      const repo = "Portfolio-Backend"; // Your repository name
      const path = "review-image/" + req.file.filename; // Path in the repository
      const filePath = `./review-image/${req.file.filename}`;

      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath).toString("base64");

        const {
          data: { sha },
        } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
          owner,
          repo,
          path,
        });

        const response = await octokit.request(
          "PUT /repos/{owner}/{repo}/contents/{path}",
          {
            owner,
            repo,
            path,
            message: "Add image",
            content: fileContent,
            committer: {
              name: "Your Name",
              email: "your@email.com",
            },
            sha, // Include the obtained SHA here
          }
        );

        if (response.status === 200) {
          return res
            .status(200)
            .json({ success: true, msg: "Review added successfully!" });
        } else {
          return res
            .status(500)
            .json({ success: false, msg: response.data.message });
        }
      } else {
        return res.status(404).json({ success: false, msg: "File not found" });
      }
    } catch (error) {
      console.error("Error:", error.message);
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
