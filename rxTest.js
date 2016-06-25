/**
 * Created by maty2_000 on 6/25/2016.
 */
var Rx = require('rxjs');

var source = Rx.Observable.range(1, 5);

// Prints out each item
var subscription = source.subscribe(
    x => console.log('onNext: %s', x),
    e => console.log('onError: %s', e),
    () => console.log('onCompleted'));

// => onNext: 1
// => onNext: 2
// => onNext: 3
// => onNext: 4
// => onNext: 5
// => onCompleted