'use strict';

var gulp = require('gulp');
//var grunseq = require('../src/index.js');
var grunseq = require('../index.js');

gulp.task('task0', function() {
  var end = grunseq.ender('task0');
  grunseq.start('task1', [ 'task2', 'task3' ], 'task4',
    end.with(function() { console.log('task0'); }));
});

gulp.task('task1', function() {
  var end = grunseq.ender('task1');
  setTimeout(end.with(function() { console.log('task1'); }), 1000);
});

gulp.task('task2', function() {
  var end = grunseq.ender('task2');
  setTimeout(end.with(function() { console.log('task2'); }), 1000);
});

gulp.task('task3', function() {
  var end = grunseq.ender('task3');
  end.wait('w0', 'w1');
  setTimeout(end.notifier('w0', function() { console.log('task3 w0'); }),1000);
  setTimeout(end.notifier('w1', function() { console.log('task3 w1'); }),500);
});

gulp.task('task4', function() {
  var end = grunseq.ender('task4');
  end.wait('w0', 'w1');
  setTimeout(end.notifier('w0', function() { console.log('task4 w0'); }),1000);
  setTimeout(end.notifier('w1', function() { console.log('task4 w1'); }),500);
});


gulp.task('default', ['task0']);
