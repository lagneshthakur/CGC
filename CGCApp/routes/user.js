var express =	require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('../public/models/user.js');	
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({extended : false}));

// Register A user
router.get('/register',function(req,res){
	res.render('register');
});
router.post('/register',function(req,res){
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;
	var dob = req.body.dob;

	// Validation
	req.checkBody('firstname', 'First Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('dob', 'Date of Birth is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);	
	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else{
		var newUser = new User({
			name: {first:firstname,last:lastname},
			email:email,
			password:password,
			dob:dob
		});
		User.createUser(newUser,function(err,user){
			if(err)
            {
            	console.log(err);
				req.flash('error_msg','You are already registered');
				res.redirect('register');
            }
            else{
            	console.log(user);
				req.flash('success_msg','You are registered and can now login');
				res.redirect('login');
            }
		});
	}
});

// Login
router.get('/login',function(req,res){
	res.render('login');
});

passport.use(new LocalStrategy(
  function(email, password, done) {
  	console.log("Login Request Received");
  	console.log("Email:",email);
  	User.getUserByEmail(email, function(err,user){
  		if(err) throw err;
  		if(!user){
  			return done(null,false,{message:"Unknown User"});
  		}
  		User.comparePassword(password, user.password,function(err, isMatch){
  			if(err) throw err;
  			if(isMatch){
  				return done(null, user);
  			}
  			else{
  				return done(null,false,{message: "Invalid Password"});
  			}
  		})
  	});
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local',{successRedirect:'/',failureRedirect:'/user/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });


// Logout
router.get('/logout',function(req,res){
	req.logout();
	req.flash('success_msg',"You are logged out.");
	res.redirect('/user/login');
});

// Return the logged in user
router.post('/getCurrentUser',function(req,res){
	res.send(req.user);
});

// Search for a user

router.get('/search', ensureAuthenticated,function(req,res){
	res.render('search',{search_user:null});
});

router.post('/search',function(req,res){
	var email = req.body.email;
	User.getUserByEmail(email, function(err,user){
  		if(err) throw err;
  		if(!user){
  			res.send("");
  		}
  		else{
  			date = new Date(user.dob);
			dob = date.getFullYear()+'-' + (months[date.getMonth()]) + '-'+date.getDate();
  			res.setHeader('Content-Type', 'application/json');
  			var json = JSON.stringify({
			    user: user, 
			    dob: dob
			  });
  			res.send(json);
  			}
  	});

});

//Follow a user
router.post('/follow',function(req,res){
	console.log("I received a post request on follow");
	var user_follow = null;
	// Add follower to the user who is to be followed by current user
	User.findOne({ _id:req.body.id},function(err,doc){
		User.update({_id: req.body.user_id}, {
		$addToSet: {
			follower: { _id : doc._id, name:{ first: doc.name.first , last: doc.name.last }} 
		}
		},function(err,affected,resp){

		});
	// Add following to the current user
	User.findOne({ _id:req.body.user_id},function(err,doc){
		user_follow = doc;
		User.update({_id: req.body.id}, {
		$addToSet: {
			following: { _id : doc._id, name:{ first: doc.name.first , last: doc.name.last }} 
		}
		}, function(err, affected, resp) {
			console.log(affected);
			console.log(resp);
			if(affected.ok)
			{
		  			var date = new Date(user_follow.dob);
					var dob = date.getFullYear()+'-' + (months[date.getMonth()]) + '-'+date.getDate();
					if(affected.nModified)
					{
						// If follow successful
			  			res.setHeader('Content-Type', 'application/json');
			  			var json = JSON.stringify({ 
						    user: user_follow, 
						    dob: dob
						  });
			  			res.send(json);
		  			}
					else{
						// If already following
			  			res.send('');
					}
			}
		});
	});
	});
});

//Unfollow a user
router.delete('/follow',function(req,res){
	var user_follow = null;
	console.log("I received a delete request on follow");
	// Remove from unfollowed user's followers list
			User.update({_id: req.body.user_id}, {
		$pull: {
			follower: { _id : req.body.id}} 
		}, function(err, affected, resp) {

		});

	// Remove from current user's following list
		User.findOne({ _id:req.body.user_id},function(err,doc){
			if(err) throw err;
			user_follow = doc;
		});
		User.update({_id: req.body.id}, {
		$pull: {
			following: { _id : req.body.user_id}} 
		}, function(err, affected, resp) {
		   if(affected.ok)
		   {
	  			var date = new Date(user_follow.dob);
				var dob = date.getFullYear()+'-' + (months[date.getMonth()]) + '-'+date.getDate();
				if(affected.nModified)
				{
					// If unfollow successful
		  			res.setHeader('Content-Type', 'application/json');
		  			var json = JSON.stringify({ 
					    user: user_follow, 
					    dob: dob
					  });
		  			res.send(json);
	  			}
		   		else{
		   			// If not following
					res.send('');
		   		}
		   }
		})
});

// Get a list of users I am following
router.get('/following',function(req,res){
	console.log("Get request on following");
	var id = mongoose.Types.ObjectId(req.query.id);
	User.findById(id,function(err,user){
		if(err) throw err;
		var following = [];
		if(user){
			for (var i = 0; i < user.following.length; i++) {
				following.push(user.following[i].name);
			}
		}
		res.send(following);
	})
});

// Get a list of my followers
router.get('/follower',function(req,res){
	console.log("Get request on follower");
	var id = mongoose.Types.ObjectId(req.query.id);
	User.findById(id,function(err,user){
		if(err) throw err;
		var follower = [];
		if(user){
			for (var i = 0; i < user.follower.length; i++) {
				follower.push(user.follower[i].name);
			}
		}
		res.send(follower);
	})
});

function ensureAuthenticated(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		// req.flash("error_msg","You are not logged in.");
		res.redirect('/user/login');
	}
}
module.exports = router;