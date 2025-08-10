const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Capital 'U' for consistency
    required: true
  },
  caption: {
    type: String,
    trim: true
  },
  like: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  comments: {
    type: Array,
    default: []
  },
  date: {
    type: Date,
    default: Date.now
  },
  shares: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  picture: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("post", postSchema);

