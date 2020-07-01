require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const logger       = require('morgan');
const path         = require('path');
const passport     = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User         = require('./models/customer.model');




const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

// require database configuration
require('./config/db.config');

const app = express();
//Session
const createSession = require('./config/session.config');
createSession(app);

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});

passport.use(
  new GoogleStrategy( {clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback"},
    (accessToken, refreshToken, profile, done) => {
      console.log("Google account details:", profile);
      User.findOne({ googleID: profile.id }).then(user => {
          if (user) {
            done(null, user);
            return;
          }
          User.create({ 
            googleID: profile.id, 
            username: profile.displayName, 
            avatar: profile.photos[0].value,
            email: profile.emails[0].value
           })
            .then(newUser => {
              done(null, newUser);
            })
            .catch(err => done(err)); // closes User.create()
        })
        .catch(err => done(err)); // closes User.findOne()
    } )
);

app.use(passport.initialize());

app.use(passport.session());


// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

hbs.registerHelper('ifCond', function (v1, operator, v2, options) {

  switch (operator) {
      case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
      case 'includes':
          return (v1.includes(v2)) ? options.fn(this) : options.inverse(this);
      default:
          return options.inverse(this);
  }
});

// default value for title local
app.locals.title = 'KOKOMO';


//ROUTES
const index = require('./routes/index.routes');
const auth = require('./routes/auth.routes');
const booking = require('./routes/booking.routes');
const property = require('./routes/property.routes');
const profile = require('./routes/profile.routes');
const search = require('./routes/search.routes');

app.use('/', index);
app.use('/', auth);
app.use('/', booking);
app.use('/', property);
app.use('/', profile);
app.use('/', search);



module.exports = app;
