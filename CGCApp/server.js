var express =	require('express');
// Init app
var app = express();
var mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var fs = require('fs');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local');



app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended : false}));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));

// View Engine
app.set('views',path.join(__dirname + '/views'));
app.engine('handlebars',exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// Express Session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global variables (for flash messages)
app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

// Routes middleware
var index = require('./routes/index');
app.use('/',index);

// Use the follow apis
var user = require('./routes/user');
app.use('/user',user);
// Use post apis
var post = require('./routes/post');
app.use('/post',post);

//Load models for mongoose
var User = require('./public/models/user.js');
var Post = require('./public/models/post.js');

// Connect mongodb: Database-CGC
mongoose.connect('mongodb://localhost:27017/CGC');

// Get all users
app.get('/users',function(req,res){
	console.log("I received a get request");
	User.find(function(err,docs){
		console.log(docs);
		res.json(docs);
	})
});

// Get all posts
app.get('/posts',function(req,res){
	console.log("I received a get request");
	Post.find(function(err,docs){
		console.log(docs);
		res.json(docs);
	})
});

http.listen(3000);
console.log("Server running on port 3000");