const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");

router.get("/new", async (req, res) => {
  res.render("authors/new", { author: new Author() });
});

router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i"); //case insensetive
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/index", { authors: authors, searchOptions: req.query });
  } catch {
    res.redirect("/");
  }
});

router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });
  try {
    const newAuthor = await author.save();
    res.redirect("authors");
  } catch (error) {
    res.render("../views/authors/new", {
      author: author,
      errorMessage: "Error saving the author",
    });
  }
});

//view
router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author: author.id }).limit(6).exec();

    res.render("authors/show", {
      author: author,
      booksByAuthors: books,
    });
  } catch (err) {
    console.log(err);

    res.redirect("/");
  }
});

//edit
router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("../views/authors/edit", {
      author: author,
    });
  } catch (err) {}
});
//update
router.put("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (err) {
    console.log(err);
    if (!author) {
      router.redirect("/");
    } else {
      res.render("authors/edit", {
        author: author,
        errorMessage: "Error updating Author",
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.remove();
    // This error occurs because the findById()method returns a plain JavaScript object,not a Mongoose document.
    // Therefore, the remove() method is not available on the author object.
    res.redirect("/authors");
  } catch (err) {
    console.log(err);
    if (!author) {
      res.redirect("/authors");
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});
module.exports = router;
