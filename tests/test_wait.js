'use strict';

var gulp = require('gulp');
require('../index.js');

gulp.task('task0', [[ 'task1', ['task2', 'task3'],'task4' ]], function(end) {
  end.with(function() { console.log('task0'); });
});

gulp.task('task1', function(end) {
  setTimeout(end.with(function() { console.log('task1'); }), 1000);
});

gulp.task('task2', function(end) {
  setTimeout(end.with(function() { console.log('task2'); }), 1000);
});

gulp.task('task3', function(end) {
  end.wait('w0', 'w1');
  setTimeout(end.notifier('w0', function() { console.log('task3 w0'); }),1000);
  setTimeout(end.notifier('w1', function() { console.log('task3 w1'); }),500);
});

gulp.task('task4', function(end) {
  end.wait('w0', 'w1', function() { console.log('task4'); });
  setTimeout(end.notifier('w0', function() { console.log('task4 w0'); }),1000);
  setTimeout(end.notifier('w1', function() { console.log('task4 w1'); }),500);
});


gulp.task('default', ['task0']);
