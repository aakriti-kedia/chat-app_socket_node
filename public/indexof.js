function both(data,users) 
{   
   for(var i=0;i<users.length;i++)
    {
    	if(users[i].from==data.from && users[i].id==data.id)
    		return i;
    }
    return -1;
}
function oneid(data,users)
{
	for(var i=0;i<users.length;i++)
    {
    	if(users[i].id==data)
    		return i;
    }
    return -1;
}
function onefrom(data,users)
{
	for(var i=0;i<users.length;i++)
    {
    	if(users[i].from==data)
    		return i;
    }
    return -1;
}
module.exports = 
{
	both,oneid,onefrom
};