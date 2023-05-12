const mongoose = require("mongoose");
const Book = require("./book");
const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

authorSchema.pre("remove", function (next) {
  Book.find({ author: this.id }, (error, books) => {
    //mongoose function
    let err = new Error("Hey stop");
    if (!error && books.length === 0) {
      next();
    }
  });
});
module.exports = mongoose.model("Author", authorSchema);
