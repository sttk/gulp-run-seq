'use strict';

var gulp = require('gulp');
var grunseq = require('../index.js');


gulp.task('task0', function() {
  var end = grunseq.ender('task0');
  end(function(){ console.log('task0 end.'); });
});

gulp.task('task1', function() {
  var end = grunseq.ender('task1');
  end(function(){ console.log('task1 end.'); });
});

gulp.task('task2', ['task2.1', 'task2.2'], function() {
  var end = grunseq.ender('task2');
  end(function(){ console.log('task2 end.'); });
});

gulp.task('task2.1', function() {
  var end = grunseq.ender('task2.1');
  end(function(){ console.log('task2.1 end.'); });
});

gulp.task('task2.2', function() {
  var end = grunseq.ender('task2.2');
  end(function(){ console.log('task2.2 end.'); });
});

gulp.task('task3', ['task3.1','task3.2','task3.3'], function() {
  var end = grunseq.ender('task3');
  end(function(){ console.log('task3 end.'); });
});

gulp.task('task3.1', function() {
  var end = grunseq.ender('task3.1');
  end(function(){ console.log('task3.1 end.'); });
});

gulp.task('task3.2', function() {
  var end = grunseq.ender('task3.2');
  end(function(){ console.log('task3.2 end.'); });
});

gulp.task('task3.3', function() {
  var end = grunseq.ender('task3.3');
  end(function(){ console.log('task3.3 end.'); });
});

gulp.task('task4', function() {
  var end = grunseq.ender('task4');
  end(function(){ console.log('task4 end.'); });
});

gulp.task('default', ['task0','task1','task2','task3','task4']);
