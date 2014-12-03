'use strict';

var gulp = require('gulp');
var fs = require('fs');

var path = '../../src/taskstt.js', src = '';
var TaskStatus = (function(path){
  var module;
  src += fs.readFileSync('../../src/util.js', {encoding:'utf8'});
  src += fs.readFileSync(path, {encoding:'utf8'});
  src = 'module = (function(){' + src + 'return TaskStatus;}());';
  eval(src);
  return module;
}(path));


gulp.task('task0');

gulp.task('task1', function() {
  TaskStatus.startTask('task1');
  TaskStatus.endTask('task1');
});

gulp.task('task2', function() {
  TaskStatus.startTask('task2');
  TaskStatus.endTask('task2');
  TaskStatus.endTask('task2');
  TaskStatus.endTask('task2');
  TaskStatus.endTask('task2');
});

gulp.task('task3', ['task3.1'], function() {
  TaskStatus.startTask('task3');
  console.log(TaskStatus.isRunnedTask('task3'));
  TaskStatus.endTask('task3');
  console.log(TaskStatus.isRunnedTask('task3'));
});

gulp.task('task3.1', function() {
  console.log(TaskStatus.isRunnedTask('task3') + ' by task3.1');
});
