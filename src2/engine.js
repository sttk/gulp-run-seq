var SeqEngine = new function() {
  this.startTasks = _startTasks;
  this.endTask = _endTask;
  this.waitTask = _entryWaitKeys;
  this.notifyTask = _notifyTask;
  this.getInfoByRunner = _getInfoByRunner;
  this.getInfoByRunningTask = _getInfoByRunningTask;
  this.log = _log;

  var gulp = require('gulp');

  var _runned = {};
  gulp.on('task_start', function(e) { _runned[e.task] = true; });
  function _isRunnedTask(taskname) { return (taskname in _runned); }

  var _runInfos = [];
  function Runner() {}
  Runner.prototype = gulp;

  function _log() {
    console.log('SeqEngine = [');
    _runInfos.forEach(function(info) { console.log(info); });
    console.log('].');
  }

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

  function _entryTasks(tasks, cb) {
    var runner = new Runner();
    var info = { runner: runner, tasks: tasks, running: {}, callback: cb };
    _runInfos.unshift(info);
    return info;
  }

  function _removeInfoIfEmpty(info) {
    if (info.tasks.length > 0) { return false; }
    var idx = _runInfos.indexOf(info);
    if (idx >= 0) { _runInfos.splice(idx, 1); }
    if (typeof(info.callback) === 'function') { info.callback(info.argument); }
    return true;
  }

  function _removeTaskIfEmpty(info, taskname, cb) {
    if (!(taskname in info.running)) { return false; }
    if (Object.keys(info.running[taskname]).length > 0) { return false; }
    delete info.running[taskname];
    if (typeof(cb) === 'function') { cb(); }
    return true;
  }

  function _entryWaitKeys(info, taskname, keys, cb) {
    var running = info.running[taskname];
    for (var i=0; i<keys.length; i++) { running[keys[i]] = cb; }
  }

  function _removeWaitKey(info, taskname, key, cb) {
    if (typeof(cb) === 'function') { cb(); }
    if (key in info.running[taskname]) {
      var taskCb = info.running[taskname][key];
      delete info.running[taskname][key];
      _removeTaskIfEmpty(info, taskname, taskCb);
      return true;
    }
    return false;
  }

  function _nextTasks(info) {
    if (_removeInfoIfEmpty(info)) { return; }
    var tasks = info.tasks.shift();
    if (! Array.isArray(tasks)) { tasks = [tasks]; }
    var taskset = [];
    for (var i=0; i<tasks.length; i++) {
      var taskname = tasks[i];
      if (typeof(taskname) !== 'string') { continue; }
      if (_isRunnedTask(taskname)) { continue; }
      taskset.push(taskname);
      info.running[taskname] = {};
    }
    gulp.start.call(info.runner, taskset);
  }


  function _startTasks(tasknames, cb) {
    var info = _entryTasks(tasknames, cb);
    _nextTasks(info);
    return info;
  }

  function _endTask(info, taskname, cb) {
    if (_removeTaskIfEmpty(info, taskname, cb)) {
      if (Object.keys(info.running).length === 0) { _nextTasks(info); }
    }
  }

  function _notifyTask(info, taskname, key, cb) {
    if (_removeWaitKey(info, taskname, key, cb)) {
      if (Object.keys(info.running).length === 0) { _nextTasks(info); }
    }
  }
};
