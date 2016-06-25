/**
 * Created by maty2_000 on 6/25/2016.
 */
'use strict'
var Redis = require('ioredis');
var Guid = require('guid');



var RequestReply = class RequestReply {
    
    constructor(redisOptions,father){


        this.init(redisOptions);
        this._reqReplyMap = new Map();
        this._father = father;

    }


    init(redisOptions) {
        this.sub = new Redis(redisOptions.port, redisOptions.host);
        this.reqReply = new Redis(redisOptions.port, redisOptions.host);
        this.reqReply.on('message', (topic, message)=> {
            this._returnCallBackReqReply(topic, message);
            //  console.log('Receive reqReply message %s from channel %s', message, topic);
        });
    }

    _returnCallBackReqReply(topic, message) {
        if (this._reqReplyMap.has(topic)) {
            let callbackMap = this._reqReplyMap.get(topic);
            callbackMap.resolve(JSON.parse(message));
        }

    }

    emit(topic, message) {
        return new Promise((resolve, reject)=> {
            let guid = Guid.create();
            this.reqReply.subscribe(topic + guid, ()=> {
                //             console.log("requestReply: "+topic+guid)
                this._reqReplyMap.set(topic + guid, {resolve: resolve, reject: reject});
                let msg =  this._father._createMessage(message);
                msg.meta.guid = guid;
                this._father.emit(topic, msg);
            })
        })
    }

    on(topic, callbackFunc) {
        var self = this;
        this.reqReply.subscribe(topic, ()=> {
            this._father.on(topic, (message)=> {
                callbackFunc(message.message, (msg)=> {
                    self._father.emit(topic + message.meta.guid, msg);
                })
            })
        })
    }


 };


module.exports = RequestReply;
