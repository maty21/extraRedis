# extraRedis
###redis api that provides lot of features


### Usage instructions:
### creating new object

```javascript

var ERedis = new extraRedis({port:6379,host:"127.0.0.1"});
```

### creating simple pub sub with multiple subscribers

```javascript

ERedis.on('foo',(message)=>{
    console.log('foo -> '+message);
},guid=>{console.log('guidfoo-> '+guid)})

ERedis.on('foo',(message)=>{
    console.log('foo2 -> '+message);
},guid=>{console.log('guidfoo2-> '+guid)})

ERedis.emit('foo','bar');

```


###  creating request reply sample so only the sending emtier will get directly the  message for his answer

```javascript
ERedis.requestReply.on('reqReplyFoo',(message,func)=>{
    console.log('reqReplyFoo=> '+message);
    func('reqReplyOnBar');
})

ERedis.requestReply.emit('reqReplyFoo','reqReplyBar').then((message)=>{
    console.log('reqReplyOnFoo-> '+message);

}).catch((e)=>{ console.log('ERROR!!!! '+e)});

```

### creating producer consumers sample so only one consumer get a job at a time

```javascript

ERedis.producerConsumer.createJob('prodConsTest');

ERedis.producerConsumer.consume('prodConsTest',(message)=>{
    console.log(`message consumed -> ${message}`);
});
ERedis.producerConsumer.consume('prodConsTest',(message)=>{
    console.log(`message consumed -> ${message}`);
});


setTimeout(()=>{
    ERedis.producerConsumer.produce('produce job 1');
    ERedis.producerConsumer.produce('produce job 2');
},5000)

```

### creating queryable instance  sample

```javascript

ERedis.queryable.createQueryableInstance('foo')
                       .subscribe(message =>{
                           console.log(`queryable Instance -> ${message}`)
                       })

```

### creating queryable instance  sample with filter

```javascript

ERedis.queryable.createQueryableInstance('foo')
    .filter((message)=>{
        return message.valueOf() =='bar'
    })
    .subscribe(message =>{
        console.log(`queryable Instance with filter -> ${message}`)
    })

```

