if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

//Routers require
const indexRouter = require("./routes/index"); //gets our exported router from the index.js router folder
const authorRouter = require("./routes/authors");
const bookRouter = require("./routes/books");
//app.set assigns a settings name a certain value
app.set("view engine", "ejs");
app.set("views", __dirname + "/views"); //_dirname holds the current directory address so it's good to have it if you're planning  to run this on multiple machines.
app.set("layout", "layouts/layout"); //no duplicates when it comes to html files (header,footer);
app.use(expressLayouts); //her we tell express that we want to use it.
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

//MONGOOSE
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true, //needed for the new mongoose version
});
const db = mongoose.connection;
db.on("error", (error) => console.log("There's an " + error));
db.once("open", () => {
  console.log("good to go!");
});
//ROUTERS USE
app.use("/", indexRouter); //on this route this router will take care of it.
app.use("/authors", authorRouter);
app.use("/books", bookRouter);
//
app.listen(process.env.PORT || 3000);
