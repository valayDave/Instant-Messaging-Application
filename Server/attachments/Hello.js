var net = require('net');
var AddRecip = require( './RecipientAdd.js' );
var CallSender= require('./Sender.js');
var CallDequeuer = require('./Dequeuer.js');
var FindRecipient = require('./RecipientFinder.js');

var Enqueuer = require('./Queuer.js');
var HOST = '192.168.0.101';
var PORT = 3002;
var events = require('events');
var eventEmitter = new events.EventEmitter()

//var dequeuer = require(".\dequeuer.js");


var data;
// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
net.createServer(function(sock) {
    
    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    
    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(xml) {

        var SendingObj ;
    	data=JSON.parse(xml);
            var Decision,IPNO,PORTNO;

    	if(data['MessageType']=="Message")
    	{
    		FindRecipient.FindRecip(data['RecipientRegNo'], function(IP,Port , Check)
    		{
                SendingObj ={'SenderRegNo':data['SenderRegNo']};
 
                SendingObj['RecipientRegNo'] = data['RecipientRegNo'];

                SendingObj['Message'] =data['Message'];
                    
                //Use this callback method to Check if the person is active or not
                //once doing so perform operations after end of the FindRecip Callback
    			console.log('CallBack Launched For Recipient Finder \n');

    			if(Check)
    			{
                    console.log('In Check \n');

    				
                     var client = new net.Socket();
                    IndividualConnection(client,Port,IP,SendingObj,function(Status)
                     {

                        if(Status)
                        console.log("Work Complete");
                        else
                        {
                             console.log("fucking Eroor");
                            //Do the Following things.

                            FindRecipient.UpdateClientStatus(SendingObj['RecipientRegNo'],"Inactive",true);

                            
                            Enqueuer.QueueMessage(SendingObj);


                        }

                        

                     });

                   
    			}	
    			else
    			{
                    Enqueuer.QueueMessage(SendingObj);

                    FindRecipient.UpdateClientStatus(SendingObj['RecipientRegNo'],"Inactive",true);


                   console.log("Queueing data");
					
    					//Call Queuer Here to Queue the Document
    			}


    		});

           console.log("decision");
            
            //DONT CALL SENDER FROM FINDRECIP

           
             


    	}

    	else if(data['MessageType']=="Echo")
    	{
    		var RecvRegNo = data['ClientRegNo'];
    		var ip =sock.remoteAddress;
    		var port = data['Port'];
    		AddRecip.NewActiveClient(RecvRegNo,ip,port, function(DequeueStatus)
    			{
    				if(DequeueStatus)
					{

                        CallDequeuer.DequeueMessages(RecvRegNo,function(Messages)
                        {
                            var i=0;
                            var socketArray = new Array(Messages.length);
                            while(i!=Messages.length)
                            {
                            SendingObj ={'SenderRegNo':Messages[i]['SenderRegNo']};
 
                            SendingObj['RecipientRegNo'] = RecvRegNo;

                             SendingObj['Message'] =Messages[i]['Message'];

                             console.log("\n"+Messages[0]['Message']+"\n");
                    
                             
                             socketArray[i] = new net.Socket();


                             IndividualConnection(socketArray[i],port,ip,SendingObj,function(Status)
                             {

                                if(Status)
                                 {
                                    FindRecipient.UpdateClientStatus(SendingObj['RecipientRegNo'],"Active",false);

                                    console.log("Work Complete");
                                 }
                                else
                                {
                                    console.log("fucking Eroor");
                                    Enqueuer.QueueMessage(SendingObj);
                                    FindRecipient.UpdateClientStatus(SendingObj['RecipientRegNo'],"Inactive",true);

 
                                }

                        

                            });
                             i++;
                        }

                        });
                      
    					
    				}

    			});


    	}
    	var x;
    	
        
    });
    
    
    
    
    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort+'  '+data);
    });
    
}).listen(PORT, HOST);






var IndividualConnection = function(socket,PORTsent,HOSTsent,Message,callback)
{
    var pr= PORTsent;
    var pi= HOSTsent;

   
    //eventEmitter.on('error', callback(false));
         socket.connect(PORTsent, HOSTsent, function() {


        
            console.log('CONNECTED TO: ' + HOSTsent + ':' + PORTsent);

            socket.write(JSON.stringify(Message));
        socket.end();

            callback(true);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
       
    

         });

socket.on('error',function (error) {

        console.log('******* ERROR ' + error + ' *******');


        // close connection
        socket.end();
        callback(false);
    });


    }

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket




