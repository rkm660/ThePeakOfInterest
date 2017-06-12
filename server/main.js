// Babel ES6/JSX Compiler
require('babel-register');

var swig = require('swig');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var routes = require('../app/routes');

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session')
var cookieParser = require('cookie-parser')

//Create app
var app = express();
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname.substring(0, __dirname.length-7), '/public')));
app.use(cookieParser())


//DB
var utils = require('./utils');

//Authentication
var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;
app.use(session({ resave: true, 'saveUninitialized': true, secret: 'secret' }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new FacebookStrategy({
        clientID: "194007337791904",
        clientSecret: "4dece9ac467427ba6778939f619ae196",
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ["id", "email", "first_name", "last_name"],
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            return utils.authenticateUser(profile, accessToken, done);
        });
    }
));

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email']}));
app.get('/auth/facebook/callback', function(req, res, next) {
    passport.authenticate('facebook', function(err, user, info) {
        if (err) {
            return next(err); }
        if (!user) {
            return res.redirect('/'); }
        req.logIn(user, function(err) {
            if (err) {
                return next(err); }
            return res.redirect('/bracket');
        });
    })(req, res, next);
});

app.get('/api/current_user', function(req, res){
    res.send(req.user);
});

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    return utils.getUser(id, done);
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


app.post('/api/random_article/', function(req, res){
    res.send("test");
})

//General routing
app.use(function(req, res) {
    Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
        if (err) {
            res.status(500).send(err.message)
        } else if (redirectLocation) {
            res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {
            var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
            var page = swig.renderFile('views/index.html', { html: html });
            res.status(200).send(page);
        } else {
            res.status(404).send('Page Not Found')
        }
    });
});

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
