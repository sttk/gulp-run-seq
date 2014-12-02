'use strict';

var gulp = require('gulp');
var fs = require('fs');

var path = '../../src/endtasks.js', src = '';
var EndTaskManager = (function(path){
  var module;
  src += fs.readFileSync('../../src/util.js', {encoding:'utf8'});
  src += fs.readFileSync(path, {encoding:'utf8'});
  src = 'module = (function(){' + src + 'return EndTaskManager;}());';
  eval(src);
  return module;
}(path));


gulp.task('task0');

gulp.task('task1', function() {
  EndTaskManager.endTask('task1');
});

gulp.task('task2', function() {
  EndTaskManager.endTask('task2');
  EndTaskManager.endTask('task2');
  EndTaskManager.endTask('task2');
  EndTaskManager.endTask('task2');
});

gulp.task('task3', ['task3.1'], function() {
  console.log(EndTaskManager.isRunnedTask('task3'));
  EndTaskManager.endTask('task3');
  console.log(EndTaskManager.isRunnedTask('task3'));
});

gulp.task('task3.1', function() {
  console.log(EndTaskManager.isRunnedTask('task3') + ' by task3.1');
});
