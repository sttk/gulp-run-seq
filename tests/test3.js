'use strict';
var gulp = require('gulp');
//var grunseq = require('../src/index.js');
var grunseq = require('../index.js');

gulp.task('task0', function() {
  var end = grunseq.ender('task0');
  gulp.start('task1', 'task2', 'task3', function() {
    end.wait('w0', 'w1', 'w2', function(){
      console.log('task0 wait end'); end();
    });

    setTimeout(function(){ end.notify('w0'); }, 1000);
    setTimeout(function(){ end.notify('w1'); }, 2000);
    setTimeout(function(){ end.notify('w2'); }, 500);
  });
});

gulp.task('task1', function() {
  var end = grunseq.ender('task1');
  setTimeout(end, 100);
});

gulp.task('task2', function() {
  var end = grunseq.ender('task2');
  setTimeout(end, 200);
});

gulp.task('task3', function() {
  var end = grunseq.ender('task3');
  setTimeout(end, 300);
});

gulp.task('no_order', [ 'task0' ]);

gulp.task('in_order', function() {
  grunseq.start('task0');
});

