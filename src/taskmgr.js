var TaskManager = new function() {
  this.startTasks = _startTasks;
  this.endTask = _endTask;
  this.waitTask = _entryWaitKeys;
  this.notifyTask = _notifyTask;
  this.getInfoByRunner = _getInfoByRunner;
  this.getInfoByRunningTask = _getInfoByRunningTask;
  this.log = function() { 
    console.log('TaskManager = [');
    for (var i=0; i<_runInfos.length; i++){console.log(_runInfos[i]);}
    console.log(']');
  };

  var _runInfos = [];
  function Runner() {}
  Runner.prototype = gulp;

  function _getInfoByRunner(runner) {
    for (var i=0; i<_runInfos.length; i++) {
      if (_runInfos[i].runner === runner) { return _runInfos[i]; }
    }
    return null;
  }

  function _getInfoByRunningTask(taskname) {
    for (var i=0; i<_runInfos.length; i++) {
      var info = _runInfos[i];
      if (taskname in info.running) { return info; }
    }
    return null;
  }

  function _clearInfo(info) {
    var idx = _runInfos.indexOf(info);
    if (idx >= 0) { _runInfos.splice(idx, 1); }
  }

  function _entryTasks(tasks, cb) {
    var runner = new Runner();
    var info = { runner:runner, tasks:tasks, running:{}, callback:cb };
    _runInfos.unshift(info);
    return info;
  }

  function _nextTasks(info) {
    if (info.tasks.length === 0) {
      _clearInfo(info);
      fnCall(info.callback);
      return;
    }

    var tasks = info.tasks.shift();
    if (! Array.isArray(tasks)) { tasks = [tasks]; }

    var tasklist = [];
    for (var i=0; i<tasks.length; i++) {
      var taskname = tasks[i];
      if (typeof(taskname) !== 'string') { continue; }
      if (EndTaskManager.isRunnedTask(taskname)) { continue; }
      tasklist.push(taskname);
      info.running[taskname] = {};
    }
    if (tasklist.length === 0) { _nextTasks(info); return; }

    gulp.start.call(info.runner, tasklist);
  }

  function _removeTask(info, taskname, cb, err) {
    if (info == null || !('running' in info) || !(taskname in info.running)) {
      EndTaskManager.endTask(taskname, cb, err, true);
      return false;
    }

    if (isEmptyObject(info.running[taskname])) {
      delete info.running[taskname];
      EndTaskManager.endTask(taskname, cb, err, true);
      return true;
    }

    return false;
  }

  function _entryWaitKeys(info, taskname, keys, cb) {
    if (info == null || !(taskname in info.running)) { return; }
    var running = info.running[taskname];
    for (var i=0; i<keys.length; i++) { running[keys[i]] = cb; }
  }

  function _removeWaitKey(info, taskname, key, cb, lastErr, err) {
    fnCall(cb, true, err);

    if (info == null || !(taskname in info.running)) { return false; }

    var waitCb = EMPTY_FN;
    if (key in info.running[taskname]) {
      waitCb = info.running[taskname][key];
      delete info.running[taskname][key];

      if (isEmptyObject(info.running[taskname])) {
        delete info.running[taskname];
        EndTaskManager.endTask(taskname, waitCb, lastErr, true);
      }
      
      return true;
    }

    return false;
  }

  function isNoRunningTask(info) {
    return isEmptyObject(info.running);
  }

  function _startTasks(tasknames, cb) {
    var info = _entryTasks(tasknames, cb);
    _nextTasks(info);
    return info;
  }

  function _endTask(info, taskname, cb, err) {
    if (_removeTask(info, taskname, cb, err)) {
      if (isNoRunningTask(info)) { _nextTasks(info); }
    }
  }

  function _notifyTask(info, taskname, key, cb, lastErr, err) {
    if (_removeWaitKey(info, taskname, key, cb, lastErr, err)) {
      if (isNoRunningTask(info)) { _nextTasks(info); }
    }
  }

};
