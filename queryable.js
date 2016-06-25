/**
 * Created by maty2_000 on 6/25/2016.
 */
'use strict'
var Rx = require('rxjs');
var queryable =  class queryable{

    constructor(redisOptions,father){
        //this._init(redisOptions);
        this._queryable=new Map();
        this._father = father;
    }

    createQueryableInstance(topic){
        let subject  = new Rx.Subject();
        this._queryable.set(topic,subject);
        this._father.on(topic,(obj)=>{
            subject.next(obj.message);
      })
        return subject;

    }
    
    
}

module.exports = queryable;