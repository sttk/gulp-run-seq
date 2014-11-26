'use strict';

var gulp = require('gulp');
//var grunseq = require('../src/index.js');
var grunseq = require('../index.js');

gulp.task('task0', ['task1', 'task4'], function() {
  console.log('==> task0 start');
  console.log('==> task0 end');
});

gulp.task('task1', function() {
   console.log('==> task1 start');
  grunseq.start('task2', 'task3', 'task5', function() {
    grunseq.ender('task1')(function() {
      console.log('==> task1 end');
    });
  });
});

gulp.task('task2', function() {
  console.log('==> task2 start');
  grunseq.start('task2.1', 'task2.2', function() {
    grunseq.ender('task2')(function() {
      console.log('==> task2 end');
    });
  });
});

gulp.task('task3', ['task3.1'],function() {
  console.log('==> task3 start');
  grunseq.ender('task3')(function() {
    console.log('==> task3 end');
  });
});

gulp.task('task3.1', function() {
  console.log('==> task3.1 start');
  grunseq.ender('task3.1')(function() {
    console.log('==> task3.1 end');
  });
});

gulp.task('task4', function() {
  console.log('==> task4 start');
  grunseq.ender('task4')(function() {
    console.log('==> task4 end');
  });
});

gulp.task('task5', function() {
  console.log('==> task5 start');
  grunseq.ender('task5')(function() {
    console.log('==> task5 end');
  });
});

gulp.task('task2.1', function() {
  console.log('==> task2.1 start');
  grunseq.ender('task2.1')(function() {
    console.log('==> task2.1 end');
  });
});

gulp.task('task2.2', function() {
  console.log('==> task2.2 start');
  grunseq.ender('task2.2')(function() {
    console.log('==> task2.2 end');
  });
});

gulp.task('default', ['task0']);
