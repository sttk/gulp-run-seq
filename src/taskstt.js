var TaskStatus = new function() {
  this.startTask = _emitTaskStart;
  this.endTask = _endTask;
  this.isRunnedTask = _isRunnedTask;

  var _runnedTasks = {};
  var _runningTasks = {};
  var _startHrtimes = {};

  var original_runTask = gulp._runTask;
  var original_taskStart = null;
  gulp._runTask = function(task) {
    if (this._events.task_start !== EMPTY_FN) {
      if (!original_taskStart){ original_taskStart = this._events.task_start; }
      this._events.task_start = EMPTY_FN;
    }
    _runnedTasks[task.name] = true;
    _runningTasks[task.name] = true;
    _startHrtimes[task.name] = process.hrtime();
    original_runTask.apply(gulp, arguments);
  };

  function _emitTaskStart(taskname) {
    fnCall(original_taskStart, {task:taskname});
    _startHrtimes[taskname] = process.hrtime();
  }

  var original_emitTaskDone = gulp._emitTaskDone;
  gulp._emitTaskDone = function() {};

  function _emitTaskDone(taskname, err) {
    var task = gulp.tasks[taskname];
    var st = _startHrtimes[taskname];
    if (st) { task.hrDuration = process.hrtime(st); }
    original_emitTaskDone.call(gulp, gulp.tasks[taskname], '', err);
  }

  function _endTask(taskname, callback, err, isSync) {
    fnCall(callback, isSync, err);
    if (taskname in _runningTasks) {
      delete _runningTasks[taskname];
      _emitTaskDone(taskname, err);
    }
  }

  function _isRunnedTask(taskname) {
    return (taskname in _runnedTasks);
  }

};
