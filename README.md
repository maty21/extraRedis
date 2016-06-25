# extraRedis
###redis api that provides lot of features
- [x] **pub/sub -** send and get messages from the job during proccessing without needing to if your message
- [x] **request/reply -** the abiliy to publish message that the response will return directly to you with simple api based on promises .
- [x] **producer/consumer -** now you can create simple job that will be sent to only one consumer at a time
- [x] **queryable -** the ability to query your returned via verity of criteria based on rx observable
- [ ] **merging multiple subscribers into one data stream**- (in the next few days) an ability to limit the number of workers that will handle the job
- [ ] **producer consumer improvements**- (in the next few days) an ability to limit the number of workers that will handle the job
More details below under the user instructions section

### Usage instructions:

#### creating new object

```javascript

var ERedis = new extraRedis({port:6379,host:"127.0.0.1"});
```

#### creating simple pub sub with multiple subscribers

```javascript

ERedis.on('foo',(message)=>{
    console.log('foo -> '+message);
},guid=>{console.log('guidfoo-> '+guid)})

ERedis.on('foo',(message)=>{
    console.log('foo2 -> '+message);
},guid=>{console.log('guidfoo2-> '+guid)})

ERedis.emit('foo','bar');

//foo -> bar
//foo2 -> bar
```


####  creating request reply so only the sending emtier will get directly the  message for his answer

```javascript
ERedis.requestReply.on('reqReplyFoo',(message,func)=>{
    console.log('reqReplyFoo-> '+message);
    func('reqReplyOnBar');
})

ERedis.requestReply.emit('reqReplyFoo','reqReplyBar').then((message)=>{
    console.log('reqReplyOnFoo-> '+message);

}).catch((e)=>{ console.log('ERROR!!!! '+e)});

// reqReplyFoo-> reqReplyBar
// reqReplyOnFoo-> reqReplyOnBar

```

#### creating producer consumers so only one consumer get a job at a time

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

// message consumed -> produce job 1
// message consumed -> produce job 2

```

#### creating queryable instance

```javascript

ERedis.queryable.createQueryableInstance('foo')
                       .subscribe(message =>{
                           console.log(`queryable Instance -> ${message}`)
                       })

// queryable Instance -> bar

```


#### creating queryable instance with filter

```javascript

ERedis.queryable.createQueryableInstance('foo')
    .filter((message)=>{
        return message.valueOf() =='bar'
    })
    .subscribe(message =>{
        console.log(`queryable Instance with filter -> ${message}`)
    })
// queryable Instance with filter -> bar

```

