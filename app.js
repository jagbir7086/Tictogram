var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
const session = require("express-session");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");

var app = express();

// ✅ MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/mydb")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ✅ View Engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// ✅ Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Uploads folder serve karna (images accessible honge browser me)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  session({
    secret: "LoveYouBaby", // 🔑 change this to a strong secret
    resave: false,
    saveUninitialized: false,
  })
);
// ✅ Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/", authRouter); // auth routes signup, login, profile

// ✅ 404 handler
app.use(function (req, res, next) {
  next(createError(404));
});

// ✅ Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
