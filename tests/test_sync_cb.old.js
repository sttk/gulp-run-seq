'use strict';

var gulp = require('gulp');
var grunseq = require('../index.js');

var _emptyFn = function(){};

gulp.task('task0', function(cb) {
  if (!cb) { cb = _emptyFn; }
  var end = grunseq.ender('task0');
  setTimeout(end.with(function(){ console.log('task0 end.'); cb();}), 2000);
});

gulp.task('task1', function(cb) {
  if (!cb) { cb = _emptyFn; }
  var end = grunseq.ender('task1');
  setTimeout(end.with(function(){ console.log('task1 end.'); cb();}), 1000);
});

gulp.task('task2', function(cb) {
  if (!cb) { cb = _emptyFn; }
  var end = grunseq.ender('task2');
  grunseq.start(['task2.1', 'task2.2'], function() {
    setTimeout(end.with(function(){ console.log('task2 end.'); cb();}), 1000);
  });
});

gulp.task('task2.1', function(cb) {
  if (!cb) { cb = _emptyFn; }
  var end = grunseq.ender('task2.1');
  setTimeout(end.with(function(){ console.log('task2.1 end.'); cb();}), 1000);
});

gulp.task('task2.2', function(cb) {
  if (!cb) { cb = _emptyFn; }
  var end = grunseq.ender('task2.2');
  setTimeout(end.with(function(){ console.log('task2.2 end.'); cb();}), 3000);
});

gulp.task('task3', function(cb) {
  if (!cb) { cb = _emptyFn; }
  var end = grunseq.ender('task3');
  grunseq.start(['task3.1', 'task3.2', 'task3.3'], function() {
    setTimeout(end.with(function(){ console.log('task3 end.'); cb();}), 1000);
  });
});

gulp.task('task3.1', function(cb) {
  if (!cb) { cb = _emptyFn; }
  var end = grunseq.ender('task3.1');
  setTimeout(end.with(function(){ console.log('task3.1 end.'); cb();}), 3000);
});

gulp.task('task3.2', function(cb) {
  if (!cb) { cb = _emptyFn; }
  var end = grunseq.ender('task3.2');
  setTimeout(end.with(function(){ console.log('task3.2 end.'); cb();}), 1000);
});

gulp.task('task3.3', function(cb) {
  if (!cb) { cb = _emptyFn; }
  var end = grunseq.ender('task3.3');
  end(function(){ console.log('task3.3 end.'); });
});

gulp.task('task4', function(cb) {
  if (!cb) { cb = _emptyFn; }
  var end = grunseq.ender('task4');
  setTimeout(end.with(function(){ console.log('task4 end.'); cb();}), 1000);
});

gulp.task('default', function() {
  var end = grunseq.ender('default');
  grunseq.start('task0', 'task1', 'task2', 'task3', 'task4');
});
