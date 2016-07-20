var express =	require('express');
var router = express.Router();
var User = require('../public/models/user.js');	
var Post = require('../public/models/post.js');

router.post('/create',function(req,res){
	console.log("I received a post request on create a post");
	// Add post for the current user
		Post.create({
			user_id: req.body.user_id,
			content: "Abcd"
		});
		res.send("Done");
});

module.exports = router;