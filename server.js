var express = require("express");
var cors = require('cors');
var port = process.env.PORT || 5000;
var path = require("path");
var passport = require('./config/passport')
var flash = require("connect-flash");

var morgan = require('morgan')
var cookieParser = require("cookie-parser");
var session = require('express-session');
var bodyParser = require("body-parser");
var hbs = require("express-handlebars");

var mainManu = require("./routes/mainMenu");
var setting = require("./routes/setting");
var agent = require("./routes/agent");
var coupon = require("./routes/coupon");
var report = require("./routes/report");

var app = express();
// allow to access with backend
app.use(cors());
 // read cookies (needed for auth)
app.use(cookieParser());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// set session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }))
//set flash message middleware
app.use(flash());
var passport = passport(app);

//serve static file from public folder
app.use(express.static("public"));

//set default folder views
app.set("views", path.join(__dirname, "views"));

//config template engine
app.engine("hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials"
  })
);

// log every request to the console
app.use(morgan('dev'));

//set view engine
app.set("view engine", "hbs");

//=============== Section Route=======================
app.get("/", function(req, res, next) {
  res.render("index");
});

app.use("/mainMenu", mainManu);
app.use("/setting", setting);
app.use("/agent", agent);
app.use("/coupon", coupon);
app.use("/report", report);

//turn on server!
app.listen(port, function(err) {
  if (err) console.log(err);
  console.log("server is running on port " + port);
});
