'use strict'
var extraRedis = require('./extraRedis');

var redisInstance = new extraRedis({port:6379,host:"127.0.0.1"});
redisInstance.on('foo',(message)=>{
    console.log('foo -> '+message);
},guid=>{console.log('guidfoo-> '+guid)})

redisInstance.on('foo',(message)=>{
    console.log('foo2 -> '+message);
},guid=>{console.log('guidfoo2-> '+guid)})

redisInstance.emit('foo','bar');



/*redisInstance.requestReplyOn('reqReplyFoo',(message,func)=>{
    console.log('reqReplyFoo=> '+message);
    func('reqReplyOnBar');
})

redisInstance.requestReply('reqReplyFoo','reqReplyBar').then((message)=>{
    console.log('reqReplyOnFoo-> '+message);
    
}).catch((e)=>{ console.log('ERROR!!!! '+e)});


redisInstance.requestReply('reqReplyFoo','reqReplyBar').then((message)=>{
    console.log('reqReplyOnFoo2-> '+message);

}).catch((e)=>{ console.log('ERROR!!!! '+e)});*/


redisInstance.requestReply.on('reqReplyFoo',(message,func)=>{
    console.log('reqReplyFoo=> '+message);
    func('reqReplyOnBar');
})

redisInstance.requestReply.emit('reqReplyFoo','reqReplyBar').then((message)=>{
    console.log('reqReplyOnFoo-> '+message);

}).catch((e)=>{ console.log('ERROR!!!! '+e)});