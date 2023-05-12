const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Author = require("../models/author");
const imageMimeTypes = ["image/jpeg,", "image/png", "image/gif", "image/jpeg"];

router.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

//query is not overwritten but if multiple parameters are present the query will include all of them(they're just added)
router.get("/", async (req, res) => {
  let query = Book.find();
  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
    query = query.lte("publishDate", req.query.publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
    query = query.gte("publishDate", req.query.publishedAfter);
  }
  try {
    const book = await query.exec();
    res.render("books/index", { book: book, searchOptions: req.query });
  } catch (error) {
    res.redirect("/");
  }
});

router.post("/", async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImage: fileName,
    description: req.body.description,
  });

  saveCover(book, req.body.cover);
  try {
    const newBook = await book.save();
    res.redirect("books");
  } catch (error) {
    console.log(error);
    renderNewPage(res, book, true);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("author").exec();

    res.render("books/show", { book: book });
  } catch (err) {
    res.redirect("/");
  }
});
// The query is then populated with the associated author's data using the populate() method
router.get("/:id/edit", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    renderEditPage(res, book);
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});
router.put("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    book.title = req.body.title;
    book.author = req.body.author;
    book.publishDate = new Date(req.body.publishDate);
    book.pageCount = req.body.pageCount;
    book.description = req.body.description;

    if (req.body.cover != null && req.body.cover != "") {
      saveCover(book, req.book.cover);
    }
    await book.save();
    res.redirect(`/books/${book.id}`);
  } catch (err) {
    console.log(err);
    res.render("books/edit", { book: book });
  }
});
router.delete("/:id", async (req, res) => {
  let book;
  try {
    book = Book.findById(req.params.id);
    await book.remove();
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect(`/books/${book.id}`);
  }
});

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, "base64");
    book.coverImageType = cover.type;
  }
}

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
async function renderEditPage(res, book) {
  try {
    const authors = await Author.find({});
    // console.log(authors);
    res.render("books/edit", { book: book, authors: authors });
  } catch (err) {
    console.log(err);
    res.redirect(`/books/${book.id}`);
  }
}

module.exports = router;
