'use strict';

var gulp = require('gulp');

gulp.task('task0', function(cb) {
  setTimeout(function() { console.log('task0 end.'); cb(); }, 2000);
});

gulp.task('task1', function(cb) {
  setTimeout(function() { console.log('task1 end.'); cb(); }, 1000);
});

gulp.task('task2', [ 'task2.1', 'task2.2' ], function(cb) {
  setTimeout(function() { console.log('task2 end.'); cb(); }, 1000);
});

gulp.task('task2.1', function(cb) {
  setTimeout(function() { console.log('task2.1 end.'); cb(); }, 1000);
});

gulp.task('task2.2', function(cb) {
  setTimeout(function() { console.log('task2.2 end.'); cb(); }, 3000);
});

gulp.task('task3', [ 'task3.1', 'task3.2', 'task3.3' ], function(cb) {
  setTimeout(function() { console.log('task3 end.'); cb(); }, 1000);
});

gulp.task('task3.1', function(cb) {
  setTimeout(function() { console.log('task3.1 end.'); cb(); }, 3000);
});

gulp.task('task3.2', function(cb) {
  setTimeout(function() { console.log('task3.2 end.'); cb(); }, 1000);
});

gulp.task('task3.3', function(cb) {
  console.log('task3.3 end.'); cb();
});

gulp.task('task4', function(cb) {
  setTimeout(function() { console.log('task4 end.'); cb(); }, 1000);
});

gulp.task('default', [ 'task0', 'task1', 'task2', 'task3', 'task4' ]);
