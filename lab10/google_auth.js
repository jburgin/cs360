var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth2').Strategy;
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
passport.use(new GoogleStrategy({
	clientID: "404219045193-n9gvul12t0pio511jbvd3qkucbnkpa44.apps.googleusercontent.com",
	clientSecret: "gjM9AMVwc1q_mXCuqEU_YL3-",
    callbackURL: 'http://cs360.jeffburgin.com/auth/google/return',
    passReqToCallback: true
  },
  function(request, accessToken, profile, done) {
    process.nextTick(function () {
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));
var app = express();
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({ secret: 'SECRET' }));
app.use(passport.initialize()); 
app.use(passport.session());
app.use(express.static(__dirname + '/static'));
app.get('/login', function(req, res){
  if(req.isAuthenticated()){
    res.redirect('/info');
  } else{
    res.render('login', { user: req.user });
  }
});
app.get('/auth/google', 
  passport.authenticate('google', { scope: 
    [ 'https://www.googleapis.com/auth/plus.login',
    , 'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
  ));
app.get('/auth/google/return', 
  passport.authenticate('google', { 
    successRedirect: '/info', 
    failureRedirect: '/login' }));
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});
app.get('/info', function(req, res){
  if(req.isAuthenticated()){
    res.render('info', { user: req.user });
  } else {
    res.redirect('/login');
  }
});
app.listen(80);