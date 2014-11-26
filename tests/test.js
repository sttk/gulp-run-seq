'use strict';

var gulp = require('gulp');
//var grunseq = require('../src/index.js');
var grunseq = require('../index.js');
var fs = require('fs');
var del = require('del');
var rename = require('gulp-rename');

gulp.task('task0', function(a1) {
  var end = grunseq.ender('task0');
  end(function() { console.log('===> task0 end.'); });
});

gulp.task('task1', function(cb) {
  var end = grunseq.ender('task1');
  setTimeout(function() {
    end(function() { console.log('===> task1 end.'); });
  }, 3000);
});

gulp.task('task2.1', function() {
  var end = grunseq.ender('task2.1');
  end(function() { console.log('===> task2.1 end.'); });
});

gulp.task('task2.2', function(cb) {
  var end = grunseq.ender('task2.2');
  console.log('===> task2.2: copying glob0.');
  gulp.src('src/glob0')
    .pipe(gulp.dest('dst'))
    .pipe(rename('glob1'))
    .pipe(gulp.dest('src'))
    .pipe(rename('glob2'))
    .pipe(gulp.dest('src'))
    .on('end', function() {
      end(function() { console.log('===> task2.2 end.'); });
     });
});

gulp.task('task2.3', function() {
  var end = grunseq.ender('task2.3');
  end(function() { console.log('===> task2.3 end.'); });
});

gulp.task('task3', function() {
  var end = grunseq.ender('task3');
  end.wait('w1', 'w2');
  console.log('===> task3: copy to dst/glob1.');
  gulp.src('src/glob1').pipe(gulp.dest('dst')).on('end', function() {
    end.notify('w1', function(seq) {
      console.log('===> task3(a) run in order? ' + seq);
      console.log('===> task3(a) end.');
    });
  });
  console.log('===> task3: copy to dst/glob2.');
  gulp.src('src/glob2').pipe(gulp.dest('dst')).on('end', function() {
    end.notify('w2', function(seq) {
      console.log('===> task3(a) run in order? ' + seq);
      console.log('===> task3(b) end.');
    });
  });
});

gulp.task('task4', [ 'task4.1', 'task4.2' ], function() {
  var end = grunseq.ender('task4');
  end.wait('w4.1', 'w4.2', function(seq) {
    console.log('===> task4: run in order? ' + seq);
    console.log('===> task4: src/glob1 exists? ', fs.existsSync('src/glob1'));
    console.log('===> task4: src/glob2 exists? ', fs.existsSync('src/glob2'));
    console.log('===> task4: dst/glob0 exists? ', fs.existsSync('dst/glob0'));
    console.log('===> task4: dst/glob1 exists? ', fs.existsSync('dst/glob1'));
    console.log('===> task4: dst/glob2 exists? ', fs.existsSync('dst/glob2'));
    console.log('===> task4 end.');
  });
});

gulp.task('task4.1', function() {
  var end = grunseq.ender('task4');
  setTimeout(function() {
    end.notify('w4.1', function(seq) {
      if (seq) { console.log('===> task4.1 end.'); }
    });
  }, 2000);
});

gulp.task('task4.2', function() {
  var end = grunseq.ender('task4');
  setTimeout(function() {
    end.notify('w4.2', function(seq) {
      if (seq) { console.log('===> task4.2 end.'); }
    });
  }, 1000);
});

gulp.task('task5', function(cb) {
  var end = grunseq.ender('task5').wait('w1', 'w2');
  del('dst/glob0', function (e0) { if (e0) { cb(e0); } else {
    console.log('===> task5: delete dst/glob0.');
    del('dst/glob1', function(e1) { if (e1) { cb(e1); } else {
      console.log('===> task5: delete dst/glob1.');
      del('dst/glob2', function(e2) { if (e2) { cb(e2); } else {
        console.log('===> task5: delete dst/glob2.');
        del('dst', function(e3) { if (e3) { cb(e3); } else {
          end.notify('w1', function(seq) {
            console.log('===> task5: delete dst.');
          });
        }});
      }});
    }});
  }});
  del(['src/glob1','src/glob2'], function(err) {
    if (!err) {
      end.notify('w2', function(seq) {
        console.log('===> task5: delete src/glob1, src/glob2');
      });
    }
  });
});

gulp.task('task6', function() {
  console.log('===> task6: src/glob1 exists? ', fs.existsSync('src/glob1'));
  console.log('===> task6: src/glob2 exists? ', fs.existsSync('src/glob2'));
  console.log('===> task6: dst/glob0 exists? ', fs.existsSync('dst/glob0'));
  console.log('===> task6: dst/glob1 exists? ', fs.existsSync('dst/glob1'));
  console.log('===> task6: dst/glob2 exists? ', fs.existsSync('dst/glob2'));
  console.log('===> task6 end.');
  grunseq.ender('task6')();
});

gulp.task('in_order', function() {
  grunseq.start('task0', 'task1', ['task2.1', 'task2.2', 'task2.3'], 'task3',
    'task4', 'task5', 'task6');
});

gulp.task('no_order', ['task0', 'task1', 'task2.1', 'task2.2', 'task2.3',
  'task3', 'task4', 'task6']);
