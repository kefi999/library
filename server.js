if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts"); //gets our layouts
const mongoose = require("mongoose");
const db = mongoose.connection;
const bodyParser = require("body-parser");

//Routers
const indexRouter = require("./routes/index"); //gets our exported router from the index.js router folder
const authorRouter = require("./routes/authors");

//app.set assigns a settings name a certain value
app.set("view engine", "ejs");
app.set("views", __dirname + "/views"); //_dirname holds the current directory address so it's good to have it if you're planning  to run this on multiple machines.
app.set("layout", "layouts/layout"); //no duplicates when it comes to html files (header,footer);
app.set(express.static("public"));

app.use(expressLayouts); //her we tell express that we want to use it.
app.use(
  bodyParser.urlencoded({
    limit: "10mb",
    extended: false,
  })
);
app.use("/", indexRouter); //on this router this router will take care of it.
app.use("/authors", authorRouter);

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true, //needed for the new mongoose version
});
db.on("error", (error) => console.log("There's an " + error));
db.once("open", () => {
  console.log("good to go!");
});
//
app.listen(process.env.PORT || 3000);
