var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

  var url = 'mongodb://localhost:27017/RecipientStore';

   module.exports = {


	FindRecip: function(ClientRegNo, callback)
  	{	

  		console.log('Reg Number of Client To Find: '+ ClientRegNo);
		MongoClient.connect(url, function(err, db) 
  		{
  			findRecipient(db,ClientRegNo, function(Client)
			{
				console.log(Client);
				//var MessageJ = JSON.parse(Messages);
				console.log(Client.length);

        if(Client.length==0)
        {
          RecipientDBAdd(db,ClientRegNo);
          callback(null,null, false);

        }

      else
       {
                var JSONObject = JSON.parse(JSON.stringify(Client));

				console.log(JSONObject);
				
				if(Client[0]['Status'] =="Active")
				{

					console.log("ClientACtive");
					callback(Client[0]['IP'],Client[0]['Port'],true);
					// Call Sender and Send on PORT AND IP


				}
				else
				{

					callback(null,null, false);
					//throw "error";



				}
  }

			});

  		});


  	},
  	UpdateClientStatus: function(ClientRegNo,ActivityVal,BoolStatus)
  	{

	console.log('Reg Number of Client To Find: '+ ClientRegNo);
		MongoClient.connect(url, function(err, db) 
  		{
  			updateStatus(db,ClientRegNo,ActivityVal,BoolStatus, function(Client)
			{
				console.log(Client);

			});

  		});


  	}


};


  	


  	 var RecipientDBAdd = function(db,ClientRegNo1) {
  // Get the documents collection
  var collection = db.collection('RecipientList');
  // Insert some documents
  collection.insert([
    {ClientRegNo : ClientRegNo1 , Status: "Inactive", DequeueStatus: true }], function(err, result) {
      console.log("Inserted 1 document into the  Recipient Db");
      assert.equal(1, result.ops.length);
  });
  } 


   var findRecipient = function(db,ClientRegNo1, callback) {
  // Get the documents collection
  var coll = db.collection('RecipientList');
  // Find some documents
  coll.find({ClientRegNo : ClientRegNo1}).toArray(function(err, docs) {
   // assert.equal(err, null);
    console.log("Found the following records");

							db.close();

  callback(docs);
  });      
}
 
var updateStatus = function(db,ClientRegNo1,Val,Stat,callback) {
  // Get the documents collection
  var collection = db.collection('RecipientList');
  // Update document where a is 2, set b equal to 1
  collection.update({ ClientRegNo : ClientRegNo1 }
    , { $set: { Status : Val, DequeueStatus: Stat   } }, function(err, result) {
    assert.equal(err, null);
    //assert.equal(1, result.result.n);
    callback(result);
  });  
}