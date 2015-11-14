'use strict';

var gulp = require('../index.js');

gulp.task('task0', function() {
  console.log('task0 end.');
});

gulp.task('task1', function() {
  console.log('task1 end.');
});

gulp.task('task2', [[ ['task2.1', 'task2.2'] ]], function() {
  console.log('task2 end.');
});

gulp.task('task2.1', function() {
  console.log('task2.1 end.');
});

gulp.task('task2.2', function() {
  console.log('task2.2 end.');
});

gulp.task('task3', [[ ['task3.1', 'task3.2', 'task3.3'] ]], function() {
  console.log('task3 end.');
});

gulp.task('task3.1', function() {
  console.log('task3.1 end.');
});

gulp.task('task3.2', function() {
  console.log('task3.2 end.');
});

gulp.task('task3.3', function() {
  console.log('task3.3 end.');
});

gulp.task('task4', function() {
  console.log('task4 end.');
});

gulp.task('default', [[ 'task0', 'task1', 'task2', 'task3', 'task4' ]]);
