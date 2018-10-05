
var socket=io.connect("http://localhost:3000");

socket.on('connection',function()
{
	console.log("Connected to server");
});	

//else value of msg remains null and error pops up..
//so window.onload needed
window.onload = function()
{
	var msg=document.getElementById('msg'),
		send=document.getElementById('send'),
		enter=document.getElementById('enter'),
		userlogin=document.getElementById('userlogin'),
		username=document.getElementById('username'),
		typing=document.getElementById('typing'),
		displaymsg=document.getElementById('displaymsg'),
		users=document.getElementById('users'),
		l=document.getElementById('l'),
		sidebar=document.getElementById('sidebar'),
		main=document.getElementById('main'),
		entrypage=document.getElementById('entrypage'),
		t=document.getElementById('time'),
		fetching=document.getElementById('fetching');
		
	var user;
	msg.addEventListener('keypress',function()
	{
		
		socket.emit('typing',{from:user,text:msg.value});
	});	
	msg.addEventListener('keyup',function()
	{
		var charcount=this.value.trim().length;
		console.log("charcount="+charcount);
		if(charcount===0)
		{
			socket.emit('nontyping');
		}
		else 
		{
			socket.emit('typing',{from:user,text:msg.value});
		}
	});
	socket.on('nontyping',function()
	{
		typing.style.display="none";
	});
	send.addEventListener('click',function()
	{
		time= new Date().getTime();
		console.log("time="+time);
		socket.emit('newmsg',{from:user,text:msg.value,time:time});
	});

	enter.addEventListener('click',function()
	{
		user=userlogin.value;
		// console.log("name=",user);
		entrypage.style.display="none";
		l.style.display="none";
		main.style.display="block";
		sidebar.style.display="block";

		socket.emit('useradd',{from:user,id:socket.id});
	});
	
	leave.addEventListener('click',function()
	{
		l.innerHTML="You left";
		l.style.display="block";
		entrypage.style.display="block";
		sidebar.style.display="none";
		main.style.display="none";
		userlogin.value="";
		socket.emit('remove',{from:user,id:socket.id});
	});

	socket.on('duplicateuser',function(data)
	{
		l.innerHTML=data.text;
		l.style.display="block";
		entrypage.style.display="block";
		sidebar.style.display="none";
		main.style.display="none";
		userlogin.value="";
	});
	
	socket.on('disconnect',function()
	{
		console.log("Disconnected from server");
	
	});	
	

	socket.on('typing',function(data)
	{
		
		typing.style.display="block";
		typing.innerHTML='<p>'+data.from+" is typing a message"+'</p>';
	});
	socket.on('newmsg',function(data)
	{
		typing.innerHTML="";
		if(data.text.trim().length!=0)
		{
			if(data.time)
			{
				data.time=moment(data.time).format('h:mm a');
		
				displaymsg.innerHTML+='<p><strong>'+data.from + " : </strong>" +data.text+'<i>'+"<br/> "+data.time+'</i>'+'</p>';
			}
			else
				displaymsg.innerHTML+='<p><strong>'+data.from + " : </strong>" +data.text+'</p>';
			
			msg.value="";
			displaymsg.scrollTop=displaymsg.scrollHeight;
		}
		else 
		{
			msg.value="";
		}
	
	});
	socket.on('userlist',function(data)
	{
		
		users.innerHTML="";
		var i=1;
		data.forEach(function(item)
		{
			if(item.id!==socket.id)
				{
					users.innerHTML+='<p>'+i+". "+item.from+'</p>';
					i=i+1;
				}
			
			
		});
		users.innerHTML+='<p>'+i+". "+"You"+'</p>';
		
	});
	sendlocation.addEventListener('click',function()
	{
		if(!navigator.geolocation)
		{
			return alert('Geolocation not supported by your browser');
		}
		navigator.geolocation.getCurrentPosition(function(position,err)
		{
			if(err)
				alert("Can't fetch location");
			else
			{
				var time=new Date().getTime();
			socket.emit('fetchinglocation',{from:user,latitude:position.coords.latitude,longitude:position.coords.longitude,time:time});
			}
			
		});
	});
	socket.on('newlocationmsg',function(data)
	{
			var url=`https://www.google.com/maps?q=${data.latitude},${data.longitude}`;
			if(data.time)
			{
				data.time=moment(data.time).format('h:mm a');
				// t.innerHTML+=data.time;
				displaymsg.innerHTML+='<p><strong>'+data.from + " : </strong>" +'<a href='+url+' target="_blank">My current Location </a>'+'<i>'+"<br/> "+data.time+'</i>'+'</p>';
			}
			else
				displaymsg.innerHTML+='<p><strong>'+data.from + " : </strong>" +'<a href='+url+' target="_blank">My current Location </a>'+'</p>';
			
			displaymsg.scrollTop=displaymsg.scrollHeight;
		
	});


}



























