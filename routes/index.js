const express = require("express");
const router = express.Router();
const Book = require("../models/book");
router.get("/", async (req, res) => {
  let book;
  try {
    book = await Book.find().sort({ createAt: "desc" }).limit(10).exec();
  } catch {
    book = [];
  }
  res.render("index", { book: book });
});

module.exports = router;
