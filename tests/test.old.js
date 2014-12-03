'use strict';

var gulp = require('gulp');
var grunseq = require('../index.js');

var fs = require('fs');
var del = require('del');
var rename = require('gulp-rename');


gulp.task('task0', function(cb) {
  console.log('===> task0 end.');
  cb();
});

gulp.task('task1', function(cb) {
  var end = grunseq.ender('task1');
  setTimeout(function() {
    end(function() { console.log('===> task1 end.'); cb(); });
  }, 3000);
});

gulp.task('task2.1', function() {
  console.log('===> task2.1 end.');
});

gulp.task('task2.2', function(cb) {
  var end = grunseq.ender('task2.2');
  console.log('===> task2.2: copying glob0.');
  gulp.src('data/glob0')
    .pipe(gulp.dest('dest'))
    .pipe(rename('glob1'))
    .pipe(gulp.dest('data'))
    .pipe(rename('glob2'))
    .pipe(gulp.dest('data'))
    .on('end', function() {
      end(function() { console.log('===> task2.2 end.'); cb(); });
     });
});

gulp.task('task2.3', function() {
  var end = grunseq.ender('task2.3');
  end(function() { console.log('===> task2.3 end.'); });
});

gulp.task('task3', function(cb) {
  var end = grunseq.ender('task3');
  end.wait('w1', 'w2', cb);
  console.log('===> task3: copy to dest/glob1.');
  gulp.src('data/glob1')
    .pipe(gulp.dest('dest'))
    .on('end', end.notifier('w1', function(seq) {
      console.log('===> task3(a) run in order? ' + seq);
      console.log('===> task3(a) end.');
    }));
  console.log('===> task3: copy to dest/glob2.');
  gulp.src('data/glob2')
    .pipe(gulp.dest('dest'))
    .on('end', end.notifier('w2', function(seq) {
      console.log('===> task3(a) run in order? ' + seq);
      console.log('===> task3(b) end.');
    }));
});

gulp.task('task4', [ 'task4.1', 'task4.2' ], function(cb) {
  var end = grunseq.ender('task4');

  console.log('===> task4: data/glob1 exists? ',fs.existsSync('data/glob1'));
  console.log('===> task4: data/glob2 exists? ',fs.existsSync('data/glob2'));
  console.log('===> task4: dest/glob0 exists? ',fs.existsSync('dest/glob0'));
  console.log('===> task4: dest/glob1 exists? ',fs.existsSync('dest/glob1'));
  console.log('===> task4: dest/glob2 exists? ',fs.existsSync('dest/glob2'));
  cb();
  end(function() {console.log('===> task4 end.');});
});

gulp.task('task4.1', function(cb) {
  var end = grunseq.ender('task4.1');
  setTimeout(end.with(function(seq) {
    console.log('===> task4.1(w4.1) run in order? ' + seq);
    if (seq) { console.log('===> task4.1 end.'); }
    cb();
  }), 2000);
});

gulp.task('task4.2', function(c) {
  var end = grunseq.ender('task4.2');
  setTimeout(end.with(function(seq) {
    console.log('===> task4.2(w4.2) run in order? ' + seq);
    if (seq) { console.log('===> task4.2 end.'); }
  }), 1000);
});

gulp.task('task5', function(cb) {
  var end = grunseq.ender('task5').wait('w1', 'w2');
  del('dest/glob0', function (e0) {
    if (e0) { cb(e0); return; }
    console.log('===> task5: delete dest/glob0.');
    del('dest/glob1', function(e1) {
      if (e1) { cb(e1); return; }
      console.log('===> task5: delete dest/glob1.');
      del('dest/glob2', function(e2) {
        if (e2) { cb(e2); return; }
        console.log('===> task5: delete dest/glob2.');
        del('dest', function(e3) {
          if (e3) { cb(e3); return; }
          console.log('===> task5: delete dest.');
          end.notify('w1', function(seq) {
            console.log('===> task5(w1) run in order? ' + seq);
          });
        });
      });
    });
  });
  del(['data/glob1','data/glob2'], function(err) {
    if (err) { console.log(err); return; }
    console.log('===> task5: delete data/glob1, data/glob2');
    end.notify('w2', function(seq) {
      console.log('===> task5(w2) run in order? ' + seq);
    });
  });
});

gulp.task('task6', function() {
  console.log('===> task6: data/glob1 exists? ', fs.existsSync('data/glob1'));
  console.log('===> task6: data/glob2 exists? ', fs.existsSync('data/glob2'));
  console.log('===> task6: dest/glob0 exists? ', fs.existsSync('dest/glob0'));
  console.log('===> task6: dest/glob1 exists? ', fs.existsSync('dest/glob1'));
  console.log('===> task6: dest/glob2 exists? ', fs.existsSync('dest/glob2'));
  console.log('===> task6 end.');
});


gulp.task('no_order', [ 'task0', 'task1', 'task2.1', 'task2.2', 'task2.3',
  'task3', 'task4', 'task5', 'task6']);

gulp.task('default', function(c) {
  grunseq.start('task0', 'task1', ['task2.1', 'task2.2', 'task2.3'], 'task3',
    'task4', 'task5', 'task6');
});
