const mongoose = require('mongoose');
const moment = require("moment");
const reviewSchema = mongoose.Schema({
     reviewBy:{
        type:String,
        default:"Anonymous"
     },
     review:{
        type:String
     },
     star:{
        type:Number,
        default:0
     },
     reviewOn: {
        type: String,
        default: moment().format("MMMM Do YYYY"),
      },
      time: {
        type: String,
        default: moment().format("LT"),
      },
})
module.exports = mongoose.model("review", reviewSchema)