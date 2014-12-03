'use strict'

var gulp = require('gulp');
var del = require('del');

gulp.task('default', function() {
  del(['./data/glob1', './data/glob2', './dest']);
});
