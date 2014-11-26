# gulp-run-seq [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

Gulp plugin to run tasks in order.

## Install

Install `gulp-run-seq` with npm:

```bash
$ npm install --save-dev gulp-run-seq
```

## Usage

First, load `gulp-run-seq` module in your gulpfile.js.

```js
var gulp = require('gulp');
var grunseq = require('gulp-run-seq');
```

Then, you can write tasks so that they are runned in order as follows.

### Simplest sequence

To achieve the simplest sequencial running, write tasks like a following example:

```js
gulp.task('default', function() {
  grunseq.start('task1', [ 'task2', 'task3' ], 'task4', function() {
    console.log('default end.');
  });
});

gulp.task('task1', function() {
  var end = grunseq.ender('task1');
  end(function() { console.log('task1 end.'); });
});

gulp.task('task2', function() {
  var end = grunseq.ender('task2');
  end(function() { console.log('task2 end.'); });
});

gulp.task('task3', function() {
  var end = grunseq.ender('task3');
  end(function() { console.log('task3 end.'); });
});

gulp.task('task4', function() {
  var end = grunseq.ender('task4');
  end(function() { console.log('task4 end.'); });
});
```

This example executes tasks in order of task1, task2/task3, task4 by default task. If an array of task names is specified as an argument, the tasks in the array are executed in no order and a next task is executed after all of these tasks end.

### Wait streaming process

If you want to make a task wait until its streaming processes end, write like a following example:

```js
gulp.task('task1', function() {
  var end = grunseq.ender('task1');
  gulp.src(...)
    .pipe(gulp.dest(...))
    .on('end', function() {
      end(function() { console.log('task1 end.'); });
    });
});
```

If a task has multiple streaming process in it, write like a following example:

```js
gulp.task('task1', function() {
  var end = grunseq.ender('task1');
  end.wait('key1', 'key2');
  gulp.src(...)
    .pipe(gulp.dest(...))
    .on('end', function() {
      end.notify('key1', function() { console.log('task1-1 end.'); });
    });
  gulp.src(...)
    .pipe(gulp.dest(...))
    .on('end', function() {
      end.notify('key2', function() { console.log('task1-2 end.'); });
    });
});
```

### Wait dependent tasks

If you want to make a task wait until its dependent tasks, write like a following example:

```js
gulp.task('task2', [ 'task2.1', 'task2.2' ], function() {
  var end = grunseq.ender('task2');
  end.wait('key0', 'key1', function(seq) {
    console.log('task2 end.');
  });
});

gulp.task('task2.1', function() {
  var end = grunseq.ender('task2');  // Notice that the task name is 'task2'.
  end.notify('key0', function(seq) {
    console.log('task2.1 end.');
  });
});

gulp.task('task2.2', function() {
  var end = grunseq.ender('task2');  // Notice that the task name is 'task2'.
  end.notify('key0', function(seq) {
    console.log('task2.2 end.');
  });
});
```

### Multiple sequences

You can make multiple sequaneces. Write like a following example:

```js
gulp.task('task1', function() {
  grunseq.start('task1.1', 'task1.2');
});

gulp.task('task1.1', function() {
  grunseq.ender('task1.1')();
});

gulp.task('task1.2', [ 'task2' ], function() {
  grunseq.ender('task1.2').wait('w2');
});

gulp.task('task2', function() {
  grunseq.start('task2.1', 'task2.2', function() {
    grunseq.ender('task1.2').notify('w2');  // Notifys to task 1.2
  });
});

gulp.task('task2.1', function() {
  grunseq.ender('task2.1')();
});

gulp.task('task2.2', function() {
  grunseq.ender('task2.2')();
});

```

If this example runs by `gulp task1`, it runs tasks in order of task1 -> task1.1 -> task2 -> task2.1 -> task2.2 -> task1.2.
Else if this example runs by `gulp task2`, it runs tasks in order of task2 -> task 2.1 -> task2.2.

### Support unordered running

Unless the `start` function is called, any functions of `gulp-run-seq` module don't wait and only their callback functions are executed immediatedly. The callback functions are passed an argument which indicates if the task passed it was run in order by the `start` function.

## APIs

`gulp-run-seq` module provides following functions:

### start(taskname, ... [, callback])

Starts a sequencial running of the specified tasks.
If a callback function is passed, it is called after all tasks end.

- **taskname** `{...string}` taskname - Task names.
- **callback** `{function}` [callback] - A callback function.

### ender(taskname)

Creates a function of the running task, which notify the end to `gulp-run-seq`.

- **taskname** `{string}` taskname - A task name.

An Ender module provides following functions:

### Ender([callback])

This function is created by a `ender` function above and notify the end of the running task to `gulp-run-seq`.
By this notification, the next task are started.
If a callback function is passed, it is called after the task end.

- **callback** `{function}` [callback] - A callback function.

### Ender#wait(keyword, ... [, callback])

This function make a task wait until the Ender object receive notifications to release the waits for all keywords.
If a callback function is passed, it is called after the wait is released.

- **keyword** `{...string}` keyword - Keywords.
- **callback** `{function}` [callback] - A callback function.

### Ender#notify(keyword [, callback])

This function notifys a release of a wait for the specified keyword to the Ender object. 
If a callback function is passed, it is called after the notification.

- **keyword** `{...string}` keyword - Keywords.
- **callback** `{function}` [callback] - A callback function.

## License

Copyright (C) 2014 Takayuki Sato.

`gulp-run-seq` is free software under [MIT](http://opensource.org/licenses/MIT) License.
See the file LICENSE in this distribution for more details.


[npm-image]: http://img.shields.io/badge/npm-v1.0.0-blue.svg
[npm-url]: https://www.npmjs.org/package/gulp-run-seq
[travis-image]: https://travis-ci.org/sttk/gulp-run-seq.svg?branch=master
[travis-url]: https://travis-ci.org/sttk/gulp-run-seq


