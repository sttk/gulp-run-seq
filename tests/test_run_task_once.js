'use strict';

var gulp = require('../index.js');

gulp.task('task0', [['task3', 'task4', 'task1', 'task2']], function(end) {
  end(function(){ console.log('task0 end'); });
});

gulp.task('task1', [['task3', 'task4']], function(end) {
  end(function(){ console.log('task1 end'); });
});

gulp.task('task2', [['task3', 'task4']], function(end) {
  end(function(){ console.log('task2 end'); });
});

gulp.task('task3', function(end) {
  setTimeout(function() {
    end(function(){ console.log('task3 end'); });
  }, 100);
});

gulp.task('task4', function(end) {
  setTimeout(function() {
    end(function(){ console.log('task4 end'); });
  }, 2000);
});


gulp.task('default', ['task0']);

