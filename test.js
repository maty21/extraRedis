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


redisInstance.requestReply.on('reqReplyFoo',(message,func)=>{
    console.log('reqReplyFoo=> '+message);
    func('reqReplyOnBar');
})

redisInstance.requestReply.emit('reqReplyFoo','reqReplyBar').then((message)=>{
    console.log('reqReplyOnFoo-> '+message);

}).catch((e)=>{ console.log('ERROR!!!! '+e)});

redisInstance.producerConsumer.createJob('prodConsTest');

redisInstance.producerConsumer.consume('prodConsTest',(message)=>{
    console.log(`message consumed -> ${message}`);
});
redisInstance.producerConsumer.consume('prodConsTest',(message)=>{
    console.log(`message consumed -> ${message}`);
});


setTimeout(()=>{
    redisInstance.producerConsumer.produce('produce job 1');
    redisInstance.producerConsumer.produce('produce job 2');
},5000)

redisInstance.queryable.createQueryableInstance('reqReplyFoo')
                       .subscribe(message =>{
                           console.log(`queryable Instance -> ${message}`)
                       })
redisInstance.queryable.createQueryableInstance('reqReplyFoo')
    .filter((message)=>{
        return message.valueOf() =='"reqReplyBar"'
    })
    .subscribe(message =>{
        console.log(`queryable Instance with filter -> ${message}`)
    })
