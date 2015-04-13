var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

  var url = 'mongodb://localhost:27017/MessageStore';

   module.exports = {


		QueueMessage: function(MessageObject)
  		{	
			MongoClient.connect(url, function(err, db) 
  			{	
  				InsertMessage(db,MessageObject,function(result)
  				{


  					if(result.ops.length>0)
  						console.log("Message Saved")
  					else 
  						console.log("MessageCouldnt be Saved");



  				});



  			});
		}
	}

	var InsertMessage = function(db,data, callback) {
  // Get the documents collection
  var collection = db.collection('RegNo'+data['RecipientRegNo']);
  // Insert some documents
  collection.insert([
    {SenderRegNo : data['SenderRegNo'] ,Message:data['Message'] }], function(err, result) {
      console.log("Inserted 1 document into the  collection");
      assert.equal(1, result.ops.length);
    callback(result);
  });
}