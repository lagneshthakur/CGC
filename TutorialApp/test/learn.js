var request = require('superagent');
var expect = require('expect.js');



describe('Suite One',function(){
	it('get contacts',function(done){
		request.get('localhost:3000/contactlist').end(function(err,res){
			//Check the response is okay or not
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			expect(res.body).to.contain("application/json");
			done();
		});
	});
});