'use strict';

var gulp = require('../index.js');

gulp.task('task0', [[ 'task1' ]], function(end) { end(); });

gulp.task('task1', function(end) { end(); });

gulp.task('default', [ 'task0' ], function(end) { end(); });
