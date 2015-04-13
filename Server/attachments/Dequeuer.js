var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

  var url = 'mongodb://localhost:27017/MessageStore';

   module.exports = {

  	DequeueMessages: function(ClientRegNo, callback)
  	{	
  		MongoClient.connect(url, function(err, db) 
  		{
  			findMessages(db,ClientRegNo ,function(Messages)
			{
				console.log(Messages);

        DeleteMessages(db,ClientRegNo,function(result)
          {

            console.log(Messages.length);


          //  Delete ALl messages and then Pass the object
           callback(Messages);


          });

				

			});

  		});

  	}

  }


var findMessages = function(db,ClientRegNo1, callback) {
  // Get the documents collection
  var coll = db.collection('RegNo'+ClientRegNo1);
  // Find some documents
  coll.find({}).toArray(function(err, docs) {
   // assert.equal(err, null);
   if(err)
   		console.log("Error in Finding Doucments");
   	else
   		console.log("Found the following records");
						

         console.log(docs.length);


  callback(docs);
  });      
}

var DeleteMessages = function(db,ClientRegNo1, callback) {
  // Get the documents collection
  var collection = db.collection('RegNo'+ClientRegNo1);
  // Insert some documents
  collection.remove({}, function(err, result) {
    assert.equal(err, null);
  //  assert.equal(1, result.result.n);
    console.log("Removed ");
    callback(result);
  });    
}