const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: [true, 'Add your email'] },
    password: { type: String, required: true },
    refreshToken: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Author', AuthorSchema);
