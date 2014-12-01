'use strict';
/*jshint eqnull:true, supernew:true, node:true */

var gulp = require('gulp');

var original_emitTaskDone = gulp._emitTaskDone;
gulp._emitTaskDone = function() {};


var grunseq = new function() {
  this.start = _start;
  this.ender = _ender;

  var _runInfos = [];
  var _runnedTasks = {};
  var _startHrtimes = {};

  var original_runTask = gulp._runTask;
  gulp._runTask = function(task) {
    _startHrtimes[task.name] = process.hrtime();
    original_runTask.apply(gulp, arguments);
  };

  function _emitTaskDone(taskname, err) {
    var task = gulp.tasks[taskname];
    var st = _startHrtimes[taskname];
    if (st) { task.hrDuration = process.hrtime(st); }
    original_emitTaskDone.call(gulp, gulp.tasks[taskname], '', err);
  }

  function Runner() {}
  Runner.prototype = gulp;

  function _findInfoByRunner(runner) {
    for (var i=0; i<_runInfos.length; i++) {
      if (_runInfos[i].runner === runner) { return _runInfos[i]; }
    }
    return null;
  }

  function _findInfoByRunningTask(taskname) {
    for (var i=0; i<_runInfos.length; i++) {
      var info = _runInfos[i];
      if (info.runner.seq.indexOf(taskname) >= 0) { return info; }
    }
    return null;
  }

  function _isAlreadyRunned(taskname) {
    return (taskname in _runnedTasks);
  }

  function _collectRunnedTasks(info) {
    var seq = info.runner.seq;
    for (var j=0; j<seq.length; j++) { _runnedTasks[seq[j]] = true; }
  }

  function _clearInfo(info) {
    var idx = _runInfos.indexOf(info);
    if (idx >= 0) { _runInfos.splice(idx, 1); }
  }

  function _isEmptyObject(obj) {
    return (Object.keys(obj).length === 0);
  }

  var _emptyFn = function() {};

  function _popCallbackFromArgs(args) {
    return (args.length === 0 || typeof(args[args.length -1]) !== 'function') ?
      _emptyFn : args.pop();
  }


  function _start(/*...tasknames [, callback]*/) {
    var args = Array.prototype.slice.call(arguments);
    var cb = _popCallbackFromArgs(args);

    var runner = new Runner();
    var tasks = args;
    var info = { 'runner':runner, 'tasks':tasks, 'running':{}, 'callback':cb };
    _runInfos.push(info);
    _next(info);
  }

  function _next(info) {
    if (info.tasks.length === 0) {
      _clearInfo(info);
      if (info.callback != null) { info.callback(); }
      return;
    }

    var tasklist = info.tasks.shift();
    if (!Array.isArray(tasklist)) { tasklist = [tasklist]; }

    var parallels = [];
    for (var i=0; i<tasklist.length; i++) {
      var taskname = tasklist[i];
      if (_isAlreadyRunned(taskname)) { continue; }
      parallels.push(taskname);
      info.running[taskname] = {};
    }
    if (parallels.length === 0) { _next(info); return; }

    _collectRunnedTasks(info);
    gulp.start.call(info.runner, parallels);
    _collectRunnedTasks(info);
  }


  function _execEnd(runner, taskname, cb, err) {
    var info = _findInfoByRunner(runner);
    if (info == null) { return; }
    if (!(taskname in info.running)) { return; }

    if (_isEmptyObject(info.running[taskname])) {
      delete info.running[taskname];
      if (typeof(cb) === 'function') { cb(true, err); }
      _emitTaskDone(taskname, err);
      if (_isEmptyObject(info.running)) { _next(info); }
    }
  }

  function _waitToEnd(runner, taskname, keys) {
    var info = _findInfoByRunner(runner);
    if (info == null) { return; }

    var waitCb = _popCallbackFromArgs(keys);

    if (!(taskname in info.running)) { return; }
    var running = info.running[taskname];

    for (var i=0; i<keys.length; i++) { running[keys[i]] = waitCb; }
  }

  function _notifyEnd(runner, taskname, key, cb, lastErr, err) {
    var info = _findInfoByRunner(runner);
    if (info == null) { return; }

    if (!(taskname in info.running)) { return; }

    var waitCb = _emptyFn;
    if (key in info.running[taskname]) {
      waitCb = info.running[taskname][key];
      delete info.running[taskname][key];
    }

    if (cb != null) { cb(true, err); }

    if (_isEmptyObject(info.running[taskname])) {
      delete info.running[taskname];
      waitCb(true, lastErr);
      _emitTaskDone(taskname, lastErr);
    }

    if (_isEmptyObject(info.running)) { _next(info); }
  }


  function Ender(runner, taskname) {
    var _lastErr = null;
    var _endFn = function(cb, err) {
      _execEnd(runner, taskname, cb, err);
    };
    _endFn.with = function(cb) {
      return function(err) { _endFn(cb, err); };
    };
    _endFn.wait = function(/*...keys [, callback]*/) {
      var keys = Array.prototype.slice.call(arguments);
      _waitToEnd(runner, taskname, keys);
      return _endFn;
    };
    function _notify(key, cb, err) {
      if (err) { _lastErr = err; }
      _notifyEnd(runner, taskname, key, cb, _lastErr, err);
      return _endFn;
    }
    _endFn.notify = _notify;
    _endFn.notifier = function(key, cb) {
      return function(err) { return _notify(key, cb, err); };
    };
    return _endFn;
  }

  var NoWaitEnder = function(name) {
    var _waiting = {};
    var _lastErr = null;
    var _endFn = function(cb, err) {
      if (typeof(cb) === 'function') { cb(false, err); }
      _emitTaskDone(name, err);
    };
    _endFn.with = function(cb) {
      return function(err) { _endFn(cb, err); };
    };
    _endFn.wait = function() {
      var keys = Array.prototype.slice.call(arguments);
      for (var i=0; i<keys.length; i++) { _waiting[keys] = true; }
      var cb = _popCallbackFromArgs(keys);
      cb(false);
      return _endFn;
    };
    function _notify(key, cb, err) {
      delete _waiting[key];
      if (cb != null) { cb(false, err); }
      if (Object.keys(_waiting).length === 0) { _emitTaskDone(name, err); }
      return _endFn;
    }
    _endFn.notify = _notify;
    _endFn.notifier = function(key, cb) {
      return function(err) { return _notify(key, cb, err); };
    };
    return _endFn;
  };

  function _ender(taskname) {
    var info = _findInfoByRunningTask(taskname);
    if (info != null) { return new Ender(info.runner, taskname); }
    return new NoWaitEnder(taskname);
  }

};

var originalTaskFn = gulp.task;
gulp.task = function(name, dep, fn) {
  if (Array.isArray(dep) && dep.length === 1 && Array.isArray(dep[0])) {
    var taskseq = dep[0], seqfn;
    if (!fn) {
      seqfn = function() {
        grunseq.start.apply(grunseq, taskseq);
      };
    } else if (fn.length > 0) {
      seqfn = function(cb) {
        var end = grunseq.ender(name);
        taskseq.push(function(cb) { fn(end); if(cb){cb();} });
        grunseq.start.apply(grunseq, taskseq);
      };
    } else {
      seqfn = function() {
        var end = grunseq.ender(name);
        taskseq.push(function() { fn(); end(); });
        grunseq.start.apply(grunseq, taskseq);
      };
    }
    return originalTaskFn.call(gulp, name, undefined, seqfn);
  } else {
    if (!fn && typeof(dep) === 'function') {
      fn = dep;
      dep = undefined;
    }
    var endFn;
    if (fn && fn.length > 0) {
      endFn = function(cb) {
        var end = grunseq.ender(name);
        fn(end); if(cb){cb();}
      };
      return originalTaskFn.call(gulp, name, dep, endFn);
    } else {
      endFn = function() {
        var end = grunseq.ender(name);
        fn(); end();
      };
    }
    return originalTaskFn.call(gulp, name, dep, endFn);
  }
};

module.exports = grunseq;
