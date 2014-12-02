'use strict';

var gulp = require('gulp');
var grunseq = require('../index.js');


gulp.task('task0', function(cb) {
  var end = grunseq.ender('task0');
  setTimeout(end.with(function(){ console.log('task0 end.'); cb(); }), 2000);
});

gulp.task('task1', function(cb) {
  var end = grunseq.ender('task1');
  setTimeout(end.with(function(){ console.log('task1 end.'); cb(); }), 1000);
});

gulp.task('task2', [ 'task2.1', 'task2.2' ], function(cb) {
  var end = grunseq.ender('task2');
  setTimeout(end.with(function(){ console.log('task2 end.'); cb(); }), 1000);
});

gulp.task('task2.1', function(cb) {
  var end = grunseq.ender('task2.1');
  setTimeout(end.with(function(){ console.log('task2.1 end.'); cb(); }), 1000);
});

gulp.task('task2.2', function(cb) {
  var end = grunseq.ender('task2.2');
  setTimeout(end.with(function(){ console.log('task2.2 end.'); cb(); }), 3000);
});

gulp.task('task3', [ 'task3.1', 'task3.2', 'task3.3' ], function(cb) {
  var end = grunseq.ender('task3');
  setTimeout(end.with(function(){ console.log('task3 end.'); cb(); }), 1000);
});

gulp.task('task3.1', function(cb) {
  var end = grunseq.ender('task3.1');
  setTimeout(end.with(function(){ console.log('task3.1 end.'); cb(); }), 3000);
});

gulp.task('task3.2', function(cb) {
  var end = grunseq.ender('task3.2');
  setTimeout(end.with(function(){ console.log('task3.2 end.'); cb(); }), 1000);
});

gulp.task('task3.3', function(cb) {
  var end = grunseq.ender('task3.3');
  end(function(){ console.log('task3.3 end.'); });
});

gulp.task('task4', function(cb) {
  var end = grunseq.ender('task4');
  setTimeout(end.with(function(){ console.log('task4 end.'); cb(); }), 1000);
});

gulp.task('default', [ 'task0', 'task1', 'task2', 'task3', 'task4' ]);
