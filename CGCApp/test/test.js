var request = require('superagent');
var expect = require('expect.js');

var test_data = {
	"id": "577ca9191154ca1433e91574",
	"user_id": "577ce7041154ca1433e9157e"
}

describe('Following Other Users',function(){
	it('Check response on following a user',function(done){
		request.post('localhost:3000/follow', test_data).end(function(err,res){
			//Check the response is okay or not
			expect(res).to.exist;

			expect(res.text).to.contain("Success");

			done();
		});
	});
});

describe.only('Unfollowing a User',function(){
	it('Check response on unfollowing a user',function(done){
		request.delete('localhost:3000/follow', test_data).end(function(err,res){
			//Check the response is okay or not
			expect(res).to.exist;

			expect(res.text).to.contain("Success");

			done();
		});
	});
});

describe('Get list of following',function(){
	it('Check response on requesting list of users that I am following',function(done){
		request.get('localhost:3000/following/' + '577ca8a21154ca1433e91572' ).end(function(err,res){
			//Check the response is okay or not
			expect(res).to.exist;
			array = JSON.parse(res.text);
			expect(array).to.be.an('array');

			done();
		});
	});
});