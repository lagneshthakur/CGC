var express =	require('express');
var mongojs = require('mongojs');
var app = express();
var db = mongojs('contactlist',['contacts']);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require('fs');
mongoose.connect('mongodb://localhost:27017/contactlist');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

//Load models
fs.readdirSync(__dirname + '/public/models').forEach(function(filename){
	if(~filename.indexOf('.js')) 
		require(__dirname + '/public/models/' + filename);
})

var contacts = mongoose.model('contacts');

app.get('/contactlist',function(req,res){
	console.log("I received a get request");
	contacts.find(function(err,docs){
		console.log(docs);
		res.json(docs);
	})
});
app.post('/contactlist',function(req,res){
	console.log(req.body);
	var contact = new contacts(req.body);
	contact.save(req.body,function(err,doc){
		res.json(doc);
	});
});

app.delete('/contactlist/:id',function(req,res){
	var id = req.params.id;
	console.log(id);
	contacts.remove({_id: mongojs.ObjectId(id)},function(err, docs){
		res.json(docs);
	})
});

app.get('/contactlist/:id',function(req,res){
	var id = req.params.id;
	console.log(id);
	contacts.findOne({_id:mongojs.ObjectId(id)},function(err,doc){
		res.json(doc);
	})
});

app.put('/contactlist/:id',function(req,res){
	var id = req.params.id;
	console.log(req.body.name);
	contacts.findByIdAndUpdate({ _id:mongojs.ObjectId(id)},
		{$set: {name: req.body.name, email: req.body.email, number: req.body.number}},
		function(err,doc){
			res.json(doc);
		});
});
app.listen(3000);
console.log("Server running on port 3000");