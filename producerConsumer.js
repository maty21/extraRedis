/**
 * Created by maty2_000 on 6/25/2016.
 */
'use strict'
var Guid = require('guid');
var producerConsumer = class producerConsumer{

    constructor(redisOptions,father){

        this.communcationChannel = "ProducerConsumer-"
        this._init(redisOptions);
        this._consumers=new Map();
        this._father = father;
        this._nextJobId= this._itterableConsumer();

    }


    _init(redisOptions) {


    }

    createJob(topic){

      this._father.on(this.communcationChannel+topic,(data)=>{
          this._consumers.set(this._consumers.size,data.id);
      })

    }
    produce(message){
       let nextJobId = this._nextJobId.next();
       let consumeId = this._consumers.get(nextJobId.value);
       this._father.emit(consumeId,message);
    }

    consume(topic,callbackFunction){
        let guid = Guid.create();
        let id = `consumer_${topic}_${guid}`;
        this._father.emit(this.communcationChannel+topic,{id:id});
        this._father.on(id,(message=>{
            callbackFunction(message);
        }))
    }

     *_itterableConsumer(){
            let counter = 0;
            while(true){
                yield counter;
                counter++;
                if(counter>this._consumers.size){
                    counter = 0;
                }
            }


        }
    }
module.exports = producerConsumer;