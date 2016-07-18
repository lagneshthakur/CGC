var express =	require('express');
var app = express();
var mongoose = require('mongoose');
var fs = require('fs');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies



app.use(express.static(__dirname + "/"));

app.get('/', function(req, res){
  res.sendfile('public/index.html');
});

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

//Follow a user
app.post('/follow',function(req,res){
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
app.delete('/follow',function(req,res){
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

app.get('/following/:id',function(req,res){
	console.log("Get request on following");
	User.findById(req.params.id,function(err,user){
		var following = [];
		for (var i = 0; i < user.following.length; i++) {
			following.push(user.following[i].name);
		}
		res.send(following);
	})
});

http.listen(3000);
console.log("Server running on port 3000");