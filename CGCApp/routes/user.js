var express =	require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('../public/models/user.js');	

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
				throw err;
			console.log(user);
		});
		req.flash('success_msg','You are registered and can now login');
		res.redirect('login');
	}
});

// Login
router.get('/login',function(req,res){
	res.render('login');
});

passport.use(new LocalStrategy(
  function(email, password, done) {
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
//Follow a user
router.post('/follow',function(req,res){
	console.log("I received a post request on follow");
	// Add follower to the user who is to be followed by current user
	User.findOne({ _id:req.body.id},function(err,doc){
		User.update({_id: req.body.user_id}, {
		$addToSet: {
			follower: { _id : doc._id, name:{ first: doc.name.first , last: doc.name.last }} 
		}
		},function(err,affected,resp){
			console.log(affected);
		});
	});
	// Add following to the current user
	User.findOne({ _id:req.body.user_id},function(err,doc){
		User.update({_id: req.body.id}, {
		$addToSet: {
			following: { _id : doc._id, name:{ first: doc.name.first , last: doc.name.last }} 
		}
		}, function(err, affected, resp) {
			if(affected.ok)
			{
					if(affected.nModified)
					{
						res.send("Successfuly Followed!");
					}
					else{
						res.send("Already Followed!");
					}
			}
		});
	});
});

//Unfollow a user
router.delete('/follow',function(req,res){
	console.log("I received a delete request on follow");
	// Remove from unfollowed user's followers list
			User.update({_id: req.body.user_id}, {
		$pull: {
			follower: { _id : req.body.id}} 
		}, function(err, affected, resp) {

		});

	// Remove from current user's following list
		User.update({_id: req.body.id}, {
		$pull: {
			following: { _id : req.body.user_id}} 
		}, function(err, affected, resp) {
		   if(affected.ok)
		   {
		   		if(affected.nModified)
		   		{
		   			res.send("Successfuly Unfollowed!");
		   		}
		   		else{
		   			res.send("Already not following!");
		   		}
		   }
		})
});

// Get a list of users I am following
router.get('/following/:id',function(req,res){
	console.log("Get request on following");
	User.findById(req.params.id,function(err,user){
		var following = [];
		for (var i = 0; i < user.following.length; i++) {
			following.push(user.following[i].name);
		}
		res.send(following);
	})
});

// Get a list of my followers
router.get('/follower/:id',function(req,res){
	console.log("Get request on follower");
	User.findById(req.params.id,function(err,user){
		var follower = [];
		for (var i = 0; i < user.follower.length; i++) {
			follower.push(user.follower[i].name);
		}
		res.send(follower);
	})
});

module.exports = router;