const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedYear: { type: Number, required: true },
  genre: [{ type: String }],
  language: { type: String, required: true },
  country: { type: String, default: "United States'" },
  rating: { type: Number, default: 0, min: 0, max: 10 },
  summary: String,
  coverImageUrl: String,
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
