var express =	require('express');
var router = express.Router();
var User = require('../public/models/user.js');	

// Register A user
router.get('/register',function(req,res){
	res.render('register');
});
// Login
router.get('/login',function(req,res){
	res.render('login');
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