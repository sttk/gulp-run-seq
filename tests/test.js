'use strict';

var gulp = require('../index.js');

var fs = require('fs');
var del = require('del');
var rename = require('gulp-rename');


gulp.task('task0', function(end) {
  end(function() { console.log('===> task0 end.'); });
});

gulp.task('task1', function(end) {
  setTimeout(function() {
    end(function() { console.log('===> task1 end.'); });
  }, 3000);
});

gulp.task('task2.1', function(end) {
  end(function() { console.log('===> task2.1 end.'); });
});

gulp.task('task2.2', function(end) {
  console.log('===> task2.2: copying glob0.');
  gulp.src('data/glob0')
    .pipe(gulp.dest('dest'))
    .pipe(rename('glob1'))
    .pipe(gulp.dest('data'))
    .pipe(rename('glob2'))
    .pipe(gulp.dest('data'))
    .on('end', end.with(function() { console.log('===> task2.2 end.'); }) );
});

gulp.task('task2.3', function(end) {
  end(function() { console.log('===> task2.3 end.'); });
});

gulp.task('task3', function(end) {
  end.wait('w1', 'w2');
  console.log('===> task3: copy to dest/glob1.');
  gulp.src('data/glob1')
    .pipe(gulp.dest('dest'))
    .on('end', end.notifier('w1', function(seq) {
      console.log('===> task3(a) end.');
    }));
  console.log('===> task3: copy to dest/glob2.');
  gulp.src('data/glob2')
    .pipe(gulp.dest('dest'))
    .on('end', end.notifier('w2', function(seq) {
      console.log('===> task3(b) end.');
    }));
});

gulp.task('task4', [[ 'task4.1', 'task4.2' ]], function(end) {
  console.log('===> task4: data/glob1 exists? ', fs.existsSync('data/glob1'));
  console.log('===> task4: data/glob2 exists? ', fs.existsSync('data/glob2'));
  console.log('===> task4: dest/glob0 exists? ', fs.existsSync('dest/glob0'));
  console.log('===> task4: dest/glob1 exists? ', fs.existsSync('dest/glob1'));
  console.log('===> task4: dest/glob2 exists? ', fs.existsSync('dest/glob2'));
  console.log('===> task4 end.');
  end();
});

gulp.task('task4.1', function(end) {
  setTimeout(end.with(function(seq) {
    if (seq) { console.log('===> task4.1 end.'); }
  }), 2000);
});

gulp.task('task4.2', function(end) {
  setTimeout(end.with(function(seq) {
    if (seq) { console.log('===> task4.2 end.'); }
  }), 1000);
});

gulp.task('task5', function(end) {
  end.wait('w1', 'w2');
  del('dest/glob0', function (e0) {
    if (e0) { console.log(e0); return; }
    console.log('===> task5: delete dest/glob0.');
    del('dest/glob1', function(e1) {
      if (e1) { console.log(e1); return; }
      console.log('===> task5: delete dest/glob1.');
      del('dest/glob2', function(e2) {
        if (e2) { console.log(e2); return; }
        console.log('===> task5: delete dest/glob2.');
        del('dest', function(e3) {
          if (e3) { console.log(e3); return; }
          console.log('===> task5: delete dest.');
          end.notify('w1', function(seq) {
            console.log('===> task5: notify w1');
          });
        });
      });
    });
  });
  del(['data/glob1','data/glob2'], function(err) {
    if (err) { console.log(err); return; }
    console.log('===> task5: delete data/glob1, data/glob2');
    end.notify('w2', function(seq) {
      console.log('===> task5: notify w2');
    });
  });
});

gulp.task('task6', function(end) {
  console.log('===> task6: data/glob1 exists? ', fs.existsSync('data/glob1'));
  console.log('===> task6: data/glob2 exists? ', fs.existsSync('data/glob2'));
  console.log('===> task6: dest/glob0 exists? ', fs.existsSync('dest/glob0'));
  console.log('===> task6: dest/glob1 exists? ', fs.existsSync('dest/glob1'));
  console.log('===> task6: dest/glob2 exists? ', fs.existsSync('dest/glob2'));
  console.log('===> task6 end.');
  end();
});


gulp.task('no_order', [ 'task0', 'task1', 'task2.1', 'task2.2', 'task2.3',
  'task3', 'task4', 'task5', 'task6']);

gulp.task('default', [[ 'task0', 'task1', ['task2.1', 'task2.2', 'task2.3'],
  'task3', 'task4', 'task5', 'task6']]);

