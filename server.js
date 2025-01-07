var express = require('express');
var bp = require('body-parser');
var mongoose = require('mongoose');
var passportlocalmongoose = require('passport-local-mongoose');
var passport = require('passport');
var passportlocal = require('passport-local');
var user = require("./database/user");

mongoose.connect("mongodb+srv://bhaargav04:2005@cluster04.hvozw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster04/Google");
var app = express();
app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: true }));

app.use(require("express-session")
({
	secret: "Bhaargav",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportlocal(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.get("/", function (req, res) {
	res.render("home");
});

app.get("/profile", isLoggedIn, function (req, res) {
	res.render("profile");
});

app.get("/signup", function (req, res) {
	res.render("signup");
});

app.post("/signup", function (req, res) {
	var firstname = req.body.firstname
	var lastname = req.body.lastname
	var username = req.body.username
	var password = req.body.password
	user.register(new user({ 
		firstname: firstname,
		lastname: lastname,
		username: username,
	    }),
			password, function (err, user) {
		if (err) {
			console.log(err);
			return res.render("signup");
		}

		passport.authenticate("local")
		(
			req, res, function () {
			res.render("signin");
		});
	});
});

app.get('/profile',function(req,res){
	res.render('profile');
})

app.get("/signin", function (req, res) {
	res.render("signin");
});

app.post("/signin", passport.authenticate("local", {
	successRedirect: "/profile",
	failureRedirect: "/signin"
}), function (req, res) {
});
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) 
	return next();
	res.redirect("/signin");
}
var port = process.env.PORT || 8000;
app.listen(port, function () {
	console.log("Server Has Started!");
});