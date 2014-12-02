'use strict';

var fs = require('fs');
var gulp = require('gulp');

var module = {};
gulp.start = function() {};

var path = './index.js';
var TaskManager = (function(path){
  var imp;
  var src = fs.readFileSync(path, {encoding:'utf8'});
  src = 'imp = (function(){' + src + 'return TaskManager;}());';
  eval(src);
  return imp;
}(path));


TaskManager.log();
console.log('task0:' + TaskManager.getInfoByRunningTask('task0'));
console.log('task1:' + TaskManager.getInfoByRunningTask('task1'));
console.log('task2:' + TaskManager.getInfoByRunningTask('task2'));

var info;
info = TaskManager.startTasks(['task0','task1','task2']);
TaskManager.log();

console.log('task0:' + TaskManager.getInfoByRunningTask('task0'));
console.log('task1:' + TaskManager.getInfoByRunningTask('task1'));
console.log('task2:' + TaskManager.getInfoByRunningTask('task2'));

TaskManager.endTask(info, 'task0');
TaskManager.log();

console.log('task0:' + TaskManager.getInfoByRunningTask('task0'));
console.log('task1:' + TaskManager.getInfoByRunningTask('task1'));
console.log('task2:' + TaskManager.getInfoByRunningTask('task2'));

TaskManager.endTask(info, 'task1');
TaskManager.log();

console.log('task0:' + TaskManager.getInfoByRunningTask('task0'));
console.log('task1:' + TaskManager.getInfoByRunningTask('task1'));
console.log('task2:' + TaskManager.getInfoByRunningTask('task2'));

TaskManager.endTask(info, 'task2');
TaskManager.log();

console.log('task0:' + TaskManager.getInfoByRunningTask('task0'));
console.log('task1:' + TaskManager.getInfoByRunningTask('task1'));
console.log('task2:' + TaskManager.getInfoByRunningTask('task2'));

TaskManager.endTask(info, 'task2');
TaskManager.log();

console.log('task0:' + TaskManager.getInfoByRunningTask('task0'));
console.log('task1:' + TaskManager.getInfoByRunningTask('task1'));
console.log('task2:' + TaskManager.getInfoByRunningTask('task2'));

console.log('-----------------');

console.log('task4:' + TaskManager.getInfoByRunningTask('task4'));
console.log('task5:' + TaskManager.getInfoByRunningTask('task5'));
console.log('task6:' + TaskManager.getInfoByRunningTask('task6'));
console.log('task7:' + TaskManager.getInfoByRunningTask('task7'));

info = TaskManager.startTasks(['task4',['task5','task6'],'task7']);
TaskManager.log();

console.log('task4:' + TaskManager.getInfoByRunningTask('task4'));
console.log('task5:' + TaskManager.getInfoByRunningTask('task5'));
console.log('task6:' + TaskManager.getInfoByRunningTask('task6'));
console.log('task7:' + TaskManager.getInfoByRunningTask('task7'));

var cb0 = function() { console.log('CALLBACK FUNCTION - 0.'); }
TaskManager.waitTask(info, 'task5', ['w0','w1'], cb0);
TaskManager.log();

console.log('task4:' + TaskManager.getInfoByRunningTask('task4'));
console.log('task5:' + TaskManager.getInfoByRunningTask('task5'));
console.log('task6:' + TaskManager.getInfoByRunningTask('task6'));
console.log('task7:' + TaskManager.getInfoByRunningTask('task7'));

TaskManager.waitTask(info, 'task4', ['w0','w1'], cb0);
TaskManager.log();

console.log('task4:' + TaskManager.getInfoByRunningTask('task4'));
console.log('task5:' + TaskManager.getInfoByRunningTask('task5'));
console.log('task6:' + TaskManager.getInfoByRunningTask('task6'));
console.log('task7:' + TaskManager.getInfoByRunningTask('task7'));

var cb1 = function() { console.log('CALLBACK FUNCTION - 1.'); }
var le = new Error('LAST ERROR');
var e = new Error('ERROR');
TaskManager.notifyTask(info, 'task6', 'w0', cb1, le, e);
TaskManager.log();

console.log('task4:' + TaskManager.getInfoByRunningTask('task4'));
console.log('task5:' + TaskManager.getInfoByRunningTask('task5'));
console.log('task6:' + TaskManager.getInfoByRunningTask('task6'));
console.log('task7:' + TaskManager.getInfoByRunningTask('task7'));

TaskManager.notifyTask(info, 'task4', 'wX', cb1, le, e);
TaskManager.log();

console.log('task4:' + TaskManager.getInfoByRunningTask('task4'));
console.log('task5:' + TaskManager.getInfoByRunningTask('task5'));
console.log('task6:' + TaskManager.getInfoByRunningTask('task6'));
console.log('task7:' + TaskManager.getInfoByRunningTask('task7'));

TaskManager.notifyTask(info, 'task4', 'w0', cb1, le, e);
TaskManager.log();

console.log('task4:' + TaskManager.getInfoByRunningTask('task4'));
console.log('task5:' + TaskManager.getInfoByRunningTask('task5'));
console.log('task6:' + TaskManager.getInfoByRunningTask('task6'));
console.log('task7:' + TaskManager.getInfoByRunningTask('task7'));

TaskManager.notifyTask(info, 'task4', 'w0', cb1, le, e);
TaskManager.log();

console.log('task4:' + TaskManager.getInfoByRunningTask('task4'));
console.log('task5:' + TaskManager.getInfoByRunningTask('task5'));
console.log('task6:' + TaskManager.getInfoByRunningTask('task6'));
console.log('task7:' + TaskManager.getInfoByRunningTask('task7'));

TaskManager.notifyTask(info, 'task4', 'w1', cb1, le, e);
TaskManager.log();

console.log('task4:' + TaskManager.getInfoByRunningTask('task4'));
console.log('task5:' + TaskManager.getInfoByRunningTask('task5'));
console.log('task6:' + TaskManager.getInfoByRunningTask('task6'));
console.log('task7:' + TaskManager.getInfoByRunningTask('task7'));

TaskManager.endTask(info, 'task5');
TaskManager.log();

console.log('task4:' + TaskManager.getInfoByRunningTask('task4'));
console.log('task5:' + TaskManager.getInfoByRunningTask('task5'));
console.log('task6:' + TaskManager.getInfoByRunningTask('task6'));
console.log('task7:' + TaskManager.getInfoByRunningTask('task7'));

TaskManager.endTask(info, 'task6');
TaskManager.log();

console.log('task4:' + TaskManager.getInfoByRunningTask('task4'));
console.log('task5:' + TaskManager.getInfoByRunningTask('task5'));
console.log('task6:' + TaskManager.getInfoByRunningTask('task6'));
console.log('task7:' + TaskManager.getInfoByRunningTask('task7'));

TaskManager.waitTask(info, 'task7', ['w0','w1'], cb0);
TaskManager.log();

console.log('task4:' + TaskManager.getInfoByRunningTask('task4'));
console.log('task5:' + TaskManager.getInfoByRunningTask('task5'));
console.log('task6:' + TaskManager.getInfoByRunningTask('task6'));
console.log('task7:' + TaskManager.getInfoByRunningTask('task7'));

TaskManager.notifyTask(info, 'task7', 'w0', cb1, le, e);
TaskManager.log();

console.log('task4:' + TaskManager.getInfoByRunningTask('task4'));
console.log('task5:' + TaskManager.getInfoByRunningTask('task5'));
console.log('task6:' + TaskManager.getInfoByRunningTask('task6'));
console.log('task7:' + TaskManager.getInfoByRunningTask('task7'));

TaskManager.notifyTask(info, 'task7', 'w1', cb1, le, e);
TaskManager.log();

console.log('task4:' + TaskManager.getInfoByRunningTask('task4'));
console.log('task5:' + TaskManager.getInfoByRunningTask('task5'));
console.log('task6:' + TaskManager.getInfoByRunningTask('task6'));
console.log('task7:' + TaskManager.getInfoByRunningTask('task7'));
