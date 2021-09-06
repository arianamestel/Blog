var express = require("express"),
  expressSantizer = require("express-sanitizer"),
  methodOverride = require("method-override"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  flash = require("connect-flash"),
  Article = require("./models/articles"),
  User = require("./models/users"),
  Comment = require("./models/comments"),
  seedDB = require("./seeds");

// requiring routes
var articleRoutes = require("./routes/articles.js"),
  commentRoutes = require("./routes/comments.js"),
  indexRoutes = require("./routes/index.js");

// APP CONFIG
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSantizer());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
var options = {
  keepAlive: 1,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.connect(
  "mongodb+srv://ariana:X6tevbJMdlYb7qay@debate.ekmwo.mongodb.net/debate?retryWrites=true&w=majority",
  options,
  (err) => {
    if (err) console.log(err);
  }
);

//passport config
app.use(
  require("express-session")({
    secret: "Ariana is the best!",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/articles", articleRoutes);
app.use("/articles/:id/comments/", commentRoutes);
app.use(indexRoutes);

app.listen(3000, function () {
  console.log("Connected to server!!");
});
// app.listen(process.env.PORT, process.env.IP);
