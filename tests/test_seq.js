'use strict';

var gulp = require('../index.js');

gulp.task('task0', function(end) {
  setTimeout(end.with(function(){ console.log('task0 end.'); }), 2000);
});

gulp.task('task1', function(end) {
  setTimeout(end.with(function(){ console.log('task1 end.'); }), 1000);
});

gulp.task('task2', [['task2.1','task2.2']], function(end) {
  setTimeout(end.with(function(){ console.log('task2 end.'); }), 1000);
});

gulp.task('task2.1', function(end) {
  setTimeout(end.with(function(){ console.log('task2.1 end.'); }), 1000);
});

gulp.task('task2.2', function(end) {
  setTimeout(end.with(function(){ console.log('task2.2 end.'); }), 3000);
});

gulp.task('task3', [['task3.1','task3.2']], function(end) {
  setTimeout(end.with(function(){ console.log('task3 end.'); }), 1000);
});

gulp.task('task3.1', function(end) {
  setTimeout(end.with(function(){ console.log('task3.1 end.'); }), 3000);
});

gulp.task('task3.2', function(end) {
  setTimeout(end.with(function(){ console.log('task3.2 end.'); }), 1000);
});

gulp.task('task3.3', function(end) {
  end(function(){ console.log('task3.3 end.'); });
});

gulp.task('task4', function(end) {
  setTimeout(end.with(function(){ console.log('task4 end.'); }), 1000);
});

gulp.task('default', [['task0', 'task1', 'task2', 'task3', 'task4']]);
