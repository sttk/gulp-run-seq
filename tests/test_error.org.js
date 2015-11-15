'use strict';

var gulp = require('gulp');

gulp.task('test00', function(end) {
  console.log('> test00');
  end(new Error());
});

gulp.task('test01', function(end) {
  console.log('> test01');
  end();
});

gulp.task('test02', [ 'test00', 'test01' ], function(end) {
  console.log('> test02');
});

gulp.task('test04', function(end) {
  console.log('> test04');
  end(function() { console.log('>> test04 end'); });
});

gulp.task('test05', [ 'test04', 'test01' ], function(end) {
  console.log('> test02');
});

