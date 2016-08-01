var request = require('superagent');
var expect = require('expect.js');

var test_data = {
	"id": "5791b8e2bf3991bc2030d26f",
	"user_id": "5791b9af5a68db8c2ac51072"
}

describe('Following Other Users',function(){
	it('Check response on following a user',function(done){
		request.post('localhost:3000/user/follow', test_data).end(function(err,res){
			//Check the response is okay or not
			expect(res).to.exist;

			expect(res.text).to.contain("");

			done();
		});
	});
});

describe('Unfollowing a User',function(){
	it('Check response on unfollowing a user',function(done){
		request.delete('localhost:3000/user/follow', test_data).end(function(err,res){
			//Check the response is okay or not
			expect(res).to.exist;

			expect(res.text).to.contain("user");

			done();
		});
	});
});

describe('Get list of following',function(){
	it('Check response on requesting list of users that I am following',function(done){
		request.get('localhost:3000/user/following/' + test_data.id ).end(function(err,res){
			//Check the response is okay or not
			expect(res).to.exist;
			array = JSON.parse(res.text);
			expect(array).to.be.an('array');

			done();
		});
	});
});

describe('Get list of followers',function(){
	it('Check response on requesting list of users that I am following',function(done){
		request.get('localhost:3000/user/follower/' + test_data.id ).end(function(err,res){
			//Check the response is okay or not
			expect(res).to.exist;
			array = JSON.parse(res.text);
			expect(array).to.be.an('array');

			done();
		});
	});
});