/**
 * Created by maty2_000 on 6/25/2016.
 */
'use strict'


var Deque = require("collections/deque");
var Guid = require('guid');
var state = class state{
    constructor(){
        this.waiting='waiting';
        this.working='working';
        this.keepAlive ='keepAlive';

    }

}
var type = class type{
    constructor(){
        this.changeState ='changeState';
        this.keepAlive ='keepAlive';

    }

}

var producerConsumer = class producerConsumer{

    constructor(redisOptions,father){

        this.communcationChannel = "ProducerConsumer-"
        this._init(redisOptions);
        this._consumers=new Map();
        this._waitingConsumers = new Set();
        this._workingConsumers = new Set();
        this._father = father;
        this._nextConsumerId= this._itterableConsumer();
        this._state = new state();
        this._type =new type();
        this._waitingJobs = new Deque();

    }


    _init(redisOptions) {


    }

    createJob(topic){

      this._father.on(this.communcationChannel+topic,(data)=>{

          if(data.state==this._state.waiting){
              this._updateDateForWaitingState(data.id)
              if(this._waitingJobs.length!=0){
               //remove from the the end of the queue
                let job = this._waitingJobs.pop();
                this.produce(job);
             }

          }
          else if (data.state==this._state.working){
              this._updateDateForWorkingState(data.id)
          }
          else if(data.type==this._type.keepAlive){
              let currentConsumerState = this._consumers.get(data.id).state;
              this._consumers.set(data.id,
                  {
                      id:data.id,
                      state: currentConsumerState,
                      lastCheckedIn:Date.now()
                  });
          }

      })
      this._checkKeepAliveState();

    }
    produce(job){
       let nextConsumerId = this._nextConsumerId.next();
       //let consumeId = this._consumers.get(nextJobId.value);
       if(nextConsumerId.value){
           this._father.emit(nextConsumerId.value,job);
           this._updateDateForWorkingState(nextConsumerId.value);
       }
       else{
           //adding data to the begining of the queue
           this._waitingJobs.unshift(job)
       }

    }

    stopProducing(topic){
        //todo:add functionality
    }

    consume(topic,callbackFunction){
        let guid = Guid.create();
        //registering to topic by sending the id
        let id = `consumer_${topic}_${guid}`;
        let  topicMessage = this.communcationChannel+topic;
        this._father.emit(topicMessage,
            {
                id:id,
                type:this._type.changeState,
                state:this._state.waiting
            });
        this._father.on(id,(message=>{
            //updating state to working
            this._father.emit(topicMessage,
                {
                    id:id,
                    type:this._type.changeState,
                    state:this._state.working
                });
            callbackFunction(message,()=>{
                //updating on job finishes
                this._father.emit(topicMessage,
                    {
                        id:id,
                        type:this._type.changeState,
                        state:this._state.waiting
                    });

            });
        }))
        this._consumerKeepAliveMessage(topicMessage,id);

    }
    _checkKeepAliveState(){
        let interval =setInterval(()=>{
            for(let consumer of this._consumers){
                if((Date.now()-consumer.lastCheckedIn)>20000){
                    this._clearConsumerData(consumer.id);
                }
            }
        },5000)
    }
    _consumerKeepAliveMessage(consumerTopic,id){
      let interval = setInterval(()=>{
          this._father.emit(consumerTopic,
              {
                  id:id,
                  type:this._type.keepAlive,

              });
      },2000)

    }
    stopConsuming(topic){
        //todo:add functionality
    }

    _updateDateForWorkingState(id){
        this._consumers.set(id,
            {
                id:id,
                state: this._state.working,
                lastCheckedIn:Date.now()
            });

        this._waitingConsumers.delete(id) ;
        this._workingConsumers.add(id) ;
    }
    _updateDateForWaitingState(id){
        this._consumers.set(id,
            {
                id:id,
                state: this._state.waiting,
                lastCheckedIn:Date.now()
            });

        this._waitingConsumers.add(id) ;
        this._workingConsumers.delete(id) ;
    }
    _clearConsumerData(id){
        this._consumers.delete(id)
        this._waitingConsumers.delete(id) ;
        this._workingConsumers.delete(id) ;
    }
    *_itterableConsumer(){
        let counter = 0;
        while(true){

            for(let consumer of this._waitingConsumers.keys() ){

                    yield consumer;

            }
            if(this._waitingConsumers.size==0){
                yield null;
            }

        }

    }
    }
module.exports = producerConsumer;