'use strict'
let extraRedis = require('./lib/extraRedis');

// creating new object
var ERedis = new extraRedis({port:6379,host:"127.0.0.1"});

//creating simple pub sub with multiple subscribers
ERedis.on('foo',(message)=>{
    console.log('foo -> '+message);
},guid=>{console.log('guidfoo-> '+guid)})

ERedis.on('foo',(message)=>{
    console.log('foo2 -> '+message);
},guid=>{console.log('guidfoo2-> '+guid)})

ERedis.emit('foo','bar');



//creating request reply sample so only the sending emtier will get directly the  message for his answer
ERedis.requestReply.on('reqReplyFoo',(message,func)=>{
    console.log('reqReplyFoo=> '+message);
    func('reqReplyOnBar');
})

ERedis.requestReply.emit('reqReplyFoo','reqReplyBar').then((message)=>{
    console.log('reqReplyOnFoo-> '+message);

}).catch((e)=>{ console.log('ERROR!!!! '+e)});



//creating producer consumers sample
ERedis.producerConsumer.createJob('prodConsTest');

ERedis.producerConsumer.consume('prodConsTest',(message,finishFunction)=>{
    setTimeout(()=>{
        console.log(`message consumed -> ${message}`);
        finishFunction();
    },5000)

});
ERedis.producerConsumer.consume('prodConsTest',(message,finishFunction)=>{
    setTimeout(()=>{
        console.log(`message consumed -> ${message}`);
        finishFunction();
    },5000)
});


setTimeout(()=>{
    ERedis.producerConsumer.produce('produce job 1');
    ERedis.producerConsumer.produce('produce job 2');
    ERedis.producerConsumer.produce('produce job 3');
    console.log("sending job for producing")
},5000)


//creating queryable instance  sample
ERedis.queryable.createQueryableInstance('foo')
                       .subscribe(message =>{
                           console.log(`queryable Instance -> ${message}`)
                       })

//creating queryable instance  sample with filter
ERedis.queryable.createQueryableInstance('foo')
    .filter((message)=>{
        return message.valueOf() =='bar'
    })
    .subscribe(message =>{
        console.log(`queryable Instance with filter -> ${message}`)
    })
