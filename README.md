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
//var gulp = require('gulp');  // not needed.
var gulp = require('gulp-run-seq');  // returns the gulp object.
```

Then, you can write tasks so that they are runned in order as follows.

### Simple sequence

To achieve the simple sequencial running, write tasks like a following example:

```js
gulp.task('default', [['task1', ['task2','task3'], 'task4']], function() {
  console.log('default end.');
});

gulp.task('task1', function() {
  console.log('task1 end.');
});

gulp.task('task2', function() {
  console.log('task2 end.');
});

gulp.task('task3', function() {
  console.log('task3 end.');
});

gulp.task('task4', function() {
  console.log('task4 end.');
});
```

This example executes tasks in order of task1 -> task2/task3 -> task4, by default task.
Writing tasks between ``[[`` and ``]]`` at the position of dependency tasks, these tasks are executed in order synchronously. Adding more tasks between `[` and `]` into there, these added tasks are executed in no order but keeped the order before and after. 

### Wait asynchronous tasks

If you want to make a task wait until its asynchronous process ends, write like a following example:

```js
gulp.task('task1', function(end) {  // Needs the argument.
  setTimeout(function() { console.log('task1 end.'); end(); }, 1000);

  /* Or, you can also write as follows:
  function fn() { console.log('task1 end.'); };
  setTimeout(function() { end(fn); }, 1000);
  setTimeout(end.with(fn), 1000);
  setTimeout(end, 1000);  // If no function is necessary.
  */
});
```

### Wait streaming process

If you want to make a task wait until its streaming processes ends, write like a following example:

```js
gulp.task('task1', function(end) {
  gulp.src(...)
    .pipe(gulp.dest(...))
    .on('end', end);
});
```

If a task has multiple streaming process in it, write like a following example:

```js
gulp.task('task1', function(end) {
  end.wait('key1', 'key2');

  gulp.src(...)
    .pipe(gulp.dest(...))
    .on('end', function(){
      end.notify('key1', function() { console.log('task1-1 end.'); });
    });

  gulp.src(...)
    .pipe(gulp.dest(...))
    .on('end', end.notifier('key2',
      function() { console.log('task1-2 end.'); }
    ));
});
```

### Wait no ordered dependent tasks

If you want to make a task wait until its no ordered dependency tasks, write like a following example:

```js
gulp.task('task2', [ 'task2.1', 'task2.2' ], function(end) {
  console.log('task2 end.');
  end();
});

gulp.task('task2.1', function() {
  console.log('task2.1 end.');
});

gulp.task('task2.2', function(end) {  // Needs `end` if an asynchronous task
  setTimeout(function() {
    console.log('task2.2 end.');
    end();
  }, 2000);
});
```

## APIs

`gulp-run-seq` module provides following functions:

### Ender([fn | err])

This function object is passed to a task function as an argument, and is used to notify the end of a running task.
By this notification, the next task is started.
If a `fn` function is passed, it is called after the task end.
If a `err` object which is not a function is passed, it aborts the gulp.

- **fn** `{function}` - A function called after the task end. .
- **err** `{object}` - An object which is not a function.

### Ender#with([fn])

This function returns a function object which executes the Ender function in it.
This function enables to write for example as ``stream.on('end', end.with(fn))`` instead of ``stream.on('end', function(){ end(fn); })``.

- **fn** `{function}` - A function called after the task end. .

### Ender#wait(keyword, ... [, fn])

This function makes a task wait until the Ender object receive notifications to release the waits for all keywords.
If a `fn` function is passed, it is called after the wait is released.

- **keyword** `{...string}` keyword - Keywords.
- **fn** `{function}` - A function called after the wait is released. .

### Ender#notify(keyword [, callback])

This function notifys a release of a wait for the specified keyword to the Ender object. 
If a `fn` function is passed, it is called after the notification.

- **keyword** `{...string}` keyword - Keywords.
- **fn** `{function}` - A function called after the notification. .

### Ender#notifier(keyword [, fn])

This function returns a function object which executes a `notify` function in it.
This function enables to write for example as: ``stream.on('end', end.notifier(key, fn))`` instead of ``stream.on('end', function(){ end.notify(key, fn); })``.

- **keyword** `{...string}` keyword - Keywords.
- **fn** `{function}` - A function called after the notification. .

### Ender#pass(fn)

This function returns a function object which executes the Ender function in it.
This function always ignores any error.
This function enables to write for example as: ``stream.on('end', end.pass(function() { console.log('finish.'); }));``.

- **fn** `{function}` - A function called after the task end. .

### Ender#abort(fn)

This function returns a function object which executes the Ender function in it.
This function always aborts the gulp and returns the exit code which is not 0.
This function enables to write for example as: ``stream.on('end', end.abort(function() { console.log('finish.'); }));``.

- **fn** `{function}` - A function called after the task end. .

## License

Copyright (C) 2014-2015 Takayuki Sato.

`gulp-run-seq` is free software under [MIT](http://opensource.org/licenses/MIT) License.
See the file LICENSE in this distribution for more details.


[npm-image]: http://img.shields.io/badge/npm-v1.2.4-blue.svg
[npm-url]: https://www.npmjs.org/package/gulp-run-seq
[travis-image]: https://travis-ci.org/sttk/gulp-run-seq.svg?branch=master
[travis-url]: https://travis-ci.org/sttk/gulp-run-seq

