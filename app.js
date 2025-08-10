var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressSession = require('express-session');
const fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const passport = require('passport');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
// Session configuration
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: "hey hey hey"
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static files with fallback for default profile image
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to handle missing default profile image
app.use((req, res, next) => {
  // Check if the request is for default-profile.jpg
  if (req.url === '/images/default-profile.jpg') {
    const defaultImagePath = path.join(__dirname, 'public', 'images', 'default-profile.jpg');
    
    // Create default image if it doesn't exist
    if (!fs.existsSync(defaultImagePath)) {
      const defaultImageDir = path.join(__dirname, 'public', 'images');
      
      // Create images directory if it doesn't exist
      if (!fs.existsSync(defaultImageDir)) {
        fs.mkdirSync(defaultImageDir, { recursive: true });
      }
      
      // Create a simple default profile image (blank avatar)
      const placeholderUrl = 'https://via.placeholder.com/150';
      const https = require('https');
      const file = fs.createWriteStream(defaultImagePath);
      https.get(placeholderUrl, response => {
        response.pipe(file);
      });
    }
  }
  next();
});

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/login', (req, res) => {
  res.render('login');
});

// Create public/images directory if it doesn't exist on startup
const publicImagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

module.exports = app;

// Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Static files served from ${path.join(__dirname, 'public')}`);
// });

app.listen(3000);