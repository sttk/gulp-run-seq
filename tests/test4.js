'use strict';

var gulp = require('gulp');
//var grunseq = require('../src/index.js');
var grunseq = require('../index.js');

gulp.task('task0', function() {
  var end = grunseq.ender('task0');
  grunseq.start('task3', 'task4', 'task1', 'task2', function(){
    end(function(){ console.log('task0 end'); });
  });
});

gulp.task('task1', function() {
  var end = grunseq.ender('task1');
  grunseq.start('task3', 'task4', function() {
    end(function(){ console.log('task1 end'); });
  });
});

gulp.task('task2', function() {
  var end = grunseq.ender('task2');
  grunseq.start('task3', 'task4', function() {
    end(function(){ console.log('task2 end'); });
  });
});

gulp.task('task3', function() {
  var end = grunseq.ender('task3');
  setTimeout(function() {
    end(function(){ console.log('task3 end'); });
  }, 100);
});

gulp.task('task4', function() {
  var end = grunseq.ender('task4');
  setTimeout(function() {
    end(function(){ console.log('task4 end'); });
  }, 2000);
});


gulp.task('default', ['task0']);

