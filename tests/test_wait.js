'use strict';

var gulp = require('../index.js');

gulp.task('task0', [[ 'task1', ['task2', 'task3'],'task4' ]], function(end) {
  end(function() { console.log('task0'); });
});

gulp.task('task00', [ 'task1', 'task2', 'task3', 'task4' ], function(end) {
  end(function() { console.log('task00'); });
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
  end.wait('w0', 'w1', 'w2', 'w3', function() { console.log('task4'); });
  setTimeout(end.notifier('w0', function() { console.log('task4 w0'); }),1000);
  setTimeout(end.notifier('w1', function() { console.log('task4 w1'); }),500);
  setTimeout(end.notifier('w2', function() { console.log('task4 w2'); }),500);
  setTimeout(end.notifier('w3', function() { console.log('task4 w3'); }),500);
});


gulp.task('default', ['task0']);
