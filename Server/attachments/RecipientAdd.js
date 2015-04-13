var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

  var url = 'mongodb://localhost:27017/RecipientStore';

  module.exports = {

  	NewActiveClient: function(ClientRegNo, IP , Port, callback)
  	{
  		MongoClient.connect(url, function(err, db) 
  		{
  			var onAdd;
  			assert.equal(null, err);
  			console.log("Connected correctly to DB");

			findRecipient(db,ClientRegNo, function(recordCheck)
			{
				if(!(recordCheck.length>0))
				{

					RecipientDBAdd(db,ClientRegNo,IP,Port, function(result) {
						db.close();
						console.log(result);
          				callback(false);
       		 		});
				}
				else
				{
					updateStatus(db,ClientRegNo,IP,Port, function(result) {
						console.log(result);
						findRecipient(db,ClientRegNo ,function(ClientRec)
						{
							db.close();
							if(ClientRec[0]['DequeueStatus'])
								callback(true);
							else
								callback(false);
          					
          				});
       		 		});

       		 		//retrive the Dequeue Status here and accordingly make callbacks'
       		 	}

			});
		});

  	}


  }

var updateStatus = function(db,ClientRegNo1,IPAddr,PortAddr,callback) {
  // Get the documents collection
  var collection = db.collection('RecipientList');
  // Update document where a is 2, set b equal to 1
  collection.update({ ClientRegNo : ClientRegNo1 }
    , { $set: {  Port : PortAddr , IP: IPAddr ,Status : "Active"  } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    callback(result);
  });  
}

  var findRecipient = function(db,ClientRegNo1, callback) {
  // Get the documents collection
  var coll = db.collection('RecipientList');
  // Find some documents
  coll.find({ClientRegNo : ClientRegNo1}).toArray(function(err, docs) {
   // assert.equal(err, null);
    console.log("Found the following records");

    console.log(docs);
  callback(docs);
  });      
}


  var RecipientDBAdd = function(db,ClientRegNo1,IPAddr,PortAddr , callback) {
  // Get the documents collection
  var collection = db.collection('RecipientList');
  // Insert some documents
  collection.insert([
    {ClientRegNo : ClientRegNo1 , Port : PortAddr , IP: IPAddr , Status: "Active", DequeueStatus: false }], function(err, result) {
      console.log("Inserted 1 document into the  collection");
      assert.equal(1, result.ops.length);
    callback(result);
  });
}