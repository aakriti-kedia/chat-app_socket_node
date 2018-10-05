const express=require("express");
const socket=require("socket.io");
var index=require('./public/indexof.js');

var app=express();

app.use(express.static("public"));
var server=app.listen(3000,function()
{
	console.log("listening to port 3000");
});
//server banne ke baad hi io mein daalna 
var io=socket(server);
var users=[];
io.on('connection',function(socket)
{
	console.log("made socket connection");
	
	socket.on('typing',function(data)
	{
		// console.log("from typing in server.js "+from);
		socket.broadcast.emit('typing',{from:data.from,text:data.text});
	});
	socket.on('nontyping',function()
	{
		io.emit('nontyping');
	})
	socket.on('newmsg',function(data)
	{
		io.emit('newmsg',{from:data.from,text:data.text,time:data.time});
	});
	socket.on('disconnect',function()
	{
		console.log("user disconnected");
		var removeuser=index.oneid(socket.id,users);
		
		// console.log("removeuser"+removeuser);
		if(removeuser!==-1)
		{
			var x=users[removeuser].from;
			console.log(x+" is removed");
			users.splice(removeuser,1);
			socket.broadcast.emit('newmsg',{from:"Admin",text:`${x} has left`});
			socket.emit('newmsg',{from:"Admin",text:"You left"});
			io.emit('userlist',users);
		}
		
	});
	
	socket.on('useradd',function(data)
	{
		if(data.from.trim().length===0)
		{
			socket.emit('duplicateuser',{text:"Username not valid"});
		}
		else 
		{
			var dupluser=index.onefrom(data.from,users);
			console.log("duplicate user:"+dupluser);
			if(dupluser===-1)
			{
				users.push({from:data.from,id:data.id});
				console.log(users);
				socket.emit('newmsg',{from:"Admin",text:` Welcome to the chat ${data.from}`});
				socket.broadcast.emit('newmsg',{from:"Admin",text:`${data.from} joined`});
				io.emit('userlist',users);
			}
			else 
			{
				socket.emit('duplicateuser',{text:"Username already taken!"});
			}
		}
		
	});
	socket.on('remove',function(data)
	{
		console.log("User to be removed"+data.from+" "+data.id);
		console.log("Remove mein users");
		console.log(users);
	
		var removeuser=index.both(data,users);
		users.splice(removeuser,1);
		console.log("remove");
		console.log(users);
		socket.broadcast.emit('newmsg',{from:"Admin",text:`${data.from} has left`});
		socket.emit('newmsg',{from:"Admin",text:"You left"});
		io.emit('userlist',users);
	});
	socket.on('fetchinglocation',function(data)
	{
		var url=`https://www.google.com/maps?q=${data.latitude},${data.longitude}`;
		 io.emit('newlocationmsg',{from:data.from,latitude:data.latitude,longitude:data.longitude,time:data.time,url:url});
	});

});













































