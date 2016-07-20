var express = require('express');
var router = express.Router();

// Get HomePage
router.get('/',function(req,res){
	console.log("Home request");
	res.render('index');
});

module.exports = router;