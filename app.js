const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const expressValidator = require('express-validator');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');

// Connecting to database
mongoose.connect(config.database,{useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;

//Check for connection
db.once('open', () => console.log("Connection made with mongodb"));

// Check for db errors
db.on('error', (err) => console.log(err));

// Init App
const app = express();

// Bring in Models
let Article = require('./models/article');
// let User = require('./models/user');

// Load view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cors());

// Set public folder static
app.use(express.static(path.join(__dirname,'public')));

// Express-session Middleware
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  }));

// Express-messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Passport Config
require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session()); 

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Home Route
app.get('/', (req, res) => {
    Article.find({}, (err, art) => {
        if(err){
          console.log(err);
          return;
        } 
        else{
          res.render('index', {title: "Articles", art});            
        }
    });
});


// Route Files
let articles = require('./routes/articles');
app.use('/articles', articles);

let users = require('./routes/users');
app.use('/users', users);

// Port Setup
const PORT = process.env.PORT || 4000;

// Start Server
app.listen(PORT, console.log(`Server started at ${PORT}`));

function ensureAuthentication(req, res, next){
  if(req.isAuthenticated())
      return next();
  else{
      req.flash('danger', 'Please login');
      res.redirect('/users/login');
  }
}