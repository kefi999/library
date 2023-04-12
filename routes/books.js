const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Author = require("../models/author");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uploadPath = path.join("public", Book.coverImageBasePath);
const imageMimeTypes = ["image/jpeg,", "image/png", "image/gif", "image/jpeg"];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

router.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

router.get("/", async (req, res) => {
  try {
    const book = await Book.find({});
    res.render("books/index", { book: book, searchOptions: req.query });
  } catch (error) {
    res.redirect("/");
  }
});

router.post("/", upload.single("cover"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImage: fileName,
    description: req.body.description,
  });

  try {
    const newBook = await book.save();
    console.log("Try");
    res.redirect("books");
  } catch (error) {
    if (book.coverImage != null) {
      removeBookCover(book.coverImage);
    }
    console.log(error);
    renderNewPage(res, book, true);
  }
});

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = { book: book, authors: authors };
    if (hasError) params.errorMessage = "Error Creating Message";
    res.render("books/new", params);
  } catch (error) {
    res.redirect("/books");
  }
}
function removeBookCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    {
      if (err) {
        console.log(error);
      }
    }
  });
}
module.exports = router;
