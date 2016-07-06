var request = require('superagent');
var expect = require('expect.js');

var test_data = {
	"id": "577ca8a21154ca1433e91572",
	"user_id": "577ca9191154ca1433e91574"
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