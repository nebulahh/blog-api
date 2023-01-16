const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DraftSchema = new Schema(
  {
    title: { type: String },
    text: { type: String },
    posted_by: { type: Schema.Types.ObjectId, required: true, ref: 'Author' },
    comment: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Draft', DraftSchema);
