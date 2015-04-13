var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/cart');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

require('./models/cart_model.js');

/************ Authentication ********************/
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
passport.use(new TwitterStrategy({
    consumerKey: "UU74VnFbQuMhiTm1GGZOPcUcv",
    consumerSecret: "9Q4LDiciDSeiieLSq8300UvOPFSeRSYrbPMAs3SjkPuoSsr8JO",
    callbackURL: "http://cs360.jeffburgin.com/auth/twitter/return"
  },
  function(token, tokenSecret, profile, done) {
	process.nextTick(function () {
		return done(null, profile);
	});
  }
));

passport.use(new GoogleStrategy({
	clientID: "404219045193-n9gvul12t0pio511jbvd3qkucbnkpa44.apps.googleusercontent.com",
	clientSecret: "gjM9AMVwc1q_mXCuqEU_YL3-",
    callbackURL: 'http://cs360.jeffburgin.com/auth/google/return',
    passReqToCallback: true
  },
  function(request, accessToken, refeshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));
/***********************************************/


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
    res.redirect('/?user=' + req.user);
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
    successRedirect: '/', 
    failureRedirect: '/login' }));
app.get('/auth/twitter',
  passport.authenticate('twitter')
);
app.get('/auth/twitter/return',
  passport.authenticate('twitter', {
	successRedirect: '/',
	failureRedirect: '/login' }));
  
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});
  var customers = require('./controllers/customers_controller');
  var products = require('./controllers/products_controller');
  var orders = require('./controllers/orders_controller');
  app.use('/static', express.static( './static')).
      use('/images', express.static( './images')).
      use('/lib', express.static( './lib')
  );
  app.get('/', function(req, res){
	if (req.user) {
		console.log(req.user);
		res.render('shopping', { user: req.user });
	} else {
		res.render('login', { user: req.user });
	}
  });
  app.get('/products/get', products.getProducts);
  app.get('/orders/get', orders.getOrders);
  app.post('/orders/add', orders.addOrder);
  app.get('/customers/get', customers.getCustomer);
  app.post('/customers/update/shipping', customers.updateShipping);
  app.post('/customers/update/billing', customers.updateBilling);
  app.post('/customers/update/cart', customers.updateCart);
app.listen(80);