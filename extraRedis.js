'use strict'
var Redis = require('ioredis');
var Guid = require('guid');
var ReqRep = require('./requestReply');
class redisStream {

    constructor(redisOptions) {
        this.sub = null;
        this.pub = null;
        this.reqReply = null;
        this.init(redisOptions);
        this._subscriberMap = new Map();
        this._reqReplyMap = new Map();
        this.reqRep = new ReqRep(redisOptions,this);

    }

    init(redisOptions) {
        this.sub = new Redis(redisOptions.port, redisOptions.host);
        this.reqReply = new Redis(redisOptions.port, redisOptions.host);
        this.pub = new Redis(redisOptions.port, redisOptions.host);
        this.sub.on('message', (topic, message)=> {
            this._returnCallBacks(topic, message);
             //  console.log('Receive message %s from channel %s', message, topic);
        });
        this.reqReply.on('message', (topic, message)=> {
            this._returnCallBackReqReply(topic, message);
            //  console.log('Receive reqReply message %s from channel %s', message, topic);
        });

    }

    emit(topic, message) {
        this.pub.publish(topic, JSON.stringify(message));
    }

    on(topic, callbackFunction, registerCallBack) {
        if (this._subscriberMap.has(topic)) {
            let callbackMap = this._subscriberMap.get(topic);
            let guid = Guid.create();
            callbackMap.set(guid, callbackFunction);
            if (registerCallBack) {
                registerCallBack(guid);
            }
        }
        else {
            let callbackMap = new Map();
            let guid = Guid.create();
            callbackMap.set(guid, callbackFunction);
            this._subscriberMap.set(topic, callbackMap);
            this.sub.subscribe(topic, ()=> {
                if (registerCallBack) {
                    registerCallBack(guid);
                }

              
            })

        }
    }
   
    _returnCallBacks(topic, message) {
        if (this._subscriberMap.has(topic)) {
            let callbackMap = this._subscriberMap.get(topic);
            callbackMap.forEach((callbackFunc, key, map)=> {
                var msgParse = message;
                //  if(message === 'object'){
                msgParse = JSON.parse(message);
                //    }
                callbackFunc(msgParse);
                //       console.log("callback called!!!!! for: "+ key)
            })
        }

    }

    _returnCallBackReqReply(topic, message) {
        if (this._reqReplyMap.has(topic)) {
            let callbackMap = this._reqReplyMap.get(topic);
            callbackMap.resolve(JSON.parse(message));
        }

    }

    _createMessage(message) {
        return {
            meta: {
                guid: null
            },
            message: JSON.stringify(message)
        }
    }

    requestReply(topic, message) {
        return new Promise((resolve, reject)=> {
            let guid = Guid.create();
            this.reqReply.subscribe(topic + guid, ()=> {
                //             console.log("requestReply: "+topic+guid)
                this._reqReplyMap.set(topic + guid, {resolve: resolve, reject: reject});
                let msg = this._createMessage(message);
                msg.meta.guid = guid;
                this.emit(topic, msg);
            })
        })
    }

    requestReplyOn(topic, callbackFunc) {
        var self = this;
        this.reqReply.subscribe(topic, ()=> {
            this.on(topic, (message)=> {
                callbackFunc(message.message, (msg)=> {
                    self.emit(topic + message.meta.guid, msg);
                })
            })
        })
    }
}


module.exports = redisStream;