var EndTaskManager = new function() {
  this.endTask = _endTask;
  this.isRunnedTask = _isRunnedTask;

  var gulp = require('gulp');

  var _runnedTasks = {};
  var _runningTasks = {};
  var _startHrtimes = {};

  var original_runTask = gulp._runTask;
  gulp._runTask = function(task) {
    _runnedTasks[task.name] = true;
    _runningTasks[task.name] = true;
    _startHrtimes[task.name] = process.hrtime();
    original_runTask.apply(gulp, arguments);
  };

  var original_emitTaskDone = gulp._emitTaskDone;
  gulp._emitTaskDone = function() {};

  function _emitTaskDone(taskname, err) {
    var task = gulp.tasks[taskname];
    var st = _startHrtimes[taskname];
    if (st) { task.hrDuration = process.hrtime(st); }
    original_emitTaskDone.call(gulp, gulp.tasks[taskname], '', err);
  }

  function _endTask(taskname, cb, err, isSync) {
    if (typeof(cb) === 'function') { cb(isSync, err); }
    if (taskname in _runningTasks) {
      delete _runningTasks[taskname];
      _emitTaskDone(taskname, err);
    }
  }

  function _isRunnedTask(taskname) {
    return (taskname in _runnedTasks);
  }
};
