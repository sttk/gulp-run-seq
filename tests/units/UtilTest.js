'use strict';

var fs = require('fs');

var module = {};

var path = './index.js';
var imp = (function(path){
  var imp;
  var src = fs.readFileSync(path, {encoding:'utf8'});
  src = 'imp = (function(){' + src +
    'return {a:EMPTY_FN,b:isEmptyObject,c:popLastCallback,d:fnCall};}());';
  eval(src);
  return imp;
}(path));
var EMPTY_FN = imp.a;
var isEmptyObject = imp.b;
var popLastCallback = imp.c;
var fnCall = imp.d;


EMPTY_FN();

console.log(isEmptyObject({}));
console.log(isEmptyObject(exports));

var arg0 = [];
var arg1 = ['a'];
var arg2 = ['a','b'];
var arg3 = ['a','b','c'];
console.log(popLastCallback(arg0)===EMPTY_FN);
console.log(popLastCallback(arg1)===EMPTY_FN);
console.log(popLastCallback(arg2)===EMPTY_FN);
console.log(popLastCallback(arg3)===EMPTY_FN);

var cb = function(){console.log('a');};
arg0.push(cb);
arg1.push(cb);
arg2.push(cb);
arg3.push(cb);
popLastCallback(arg0)();
popLastCallback(arg1)();
popLastCallback(arg2)();
popLastCallback(arg3)();

fnCall();
fnCall('a');
fnCall(1234);
fnCall(function() { console.log('AA'); });
fnCall(function(a,b) { console.log(a + ',' + b); }, 'A', 'B');
