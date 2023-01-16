const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    username: { type: String },
    text: { type: String },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Comment', CommentSchema);
