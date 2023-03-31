const express = require("express");
const router = express.Router();
const Author = require("../models/author");

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
//get post url safety

module.exports = router;
