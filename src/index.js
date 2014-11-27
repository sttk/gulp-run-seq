'use strict';
/*jshint eqnull:true, supernew:true, node:true */

var gulp = require('gulp');

var grunseq = new function() {

  this.start = _start;
  this.ender = _ender;


  var _runInfos = [];
  var _runnedTasks = {};

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
    gulp.start.apply(info.runner, parallels);
    _collectRunnedTasks(info);
  }


  function _execEnd(runner, taskname, cb) {
    var info = _findInfoByRunner(runner);
    if (info == null) { return; }
    if (!(taskname in info.running)) { return; }

    if (_isEmptyObject(info.running[taskname])) {
      delete info.running[taskname];
      if (typeof(cb) === 'function') { cb(true); }
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

  function _notifyEnd(runner, taskname, key, cb) {
    var info = _findInfoByRunner(runner);
    if (info == null) { return; }

    if (!(taskname in info.running)) { return; }

    var waitCb = _emptyFn;
    if (key in info.running[taskname]) {
      waitCb = info.running[taskname][key];
      delete info.running[taskname][key];
    }

    if (_isEmptyObject(info.running[taskname])) {
      delete info.running[taskname];
    }

    if (cb != null) { cb(true); }
    if (_isEmptyObject(info.running)) { waitCb(true); _next(info); }
  }


  function Ender(runner, taskname) {
    var _endFn = function(cb) {
      _execEnd(runner, taskname, cb);
    };
    _endFn.with = function(cb) {
      return function() { _endFn(cb); };
    };
    _endFn.wait = function(/*...keys [, callback]*/) {
      var keys = Array.prototype.slice.call(arguments);
      _waitToEnd(runner, taskname, keys);
      return _endFn;
    };
    _endFn.notify = function(key, cb) {
      _notifyEnd(runner, taskname, key, cb);
      return _endFn;
    };
    _endFn.notifier = function(key, cb) {
      return function() {
        _notifyEnd(runner, taskname, key, cb);
        return _endFn;
      };
    };
    return _endFn;
  }

  var _nowaitFn = new function() {
    var _endFn = function(cb) {
      if (typeof(cb) === 'function') { cb(false); }
    };
    _endFn.with = function(cb) {
      return function() { _endFn(cb); };
    };
    _endFn.wait = function() {
      var keys = Array.prototype.slice.call(arguments);
      var cb = _popCallbackFromArgs(keys);
      cb(false);
      return _endFn;
    };
    function _notify(key, cb) {
      if (cb != null) { cb(false); }
      return _endFn;
    }
    _endFn.notify = _notify;
    _endFn.notifier = function(key, cb) {
      return function() { return _notify(key, cb); };
    };
    return _endFn;
  };

  function _ender(taskname) {
    var info = _findInfoByRunningTask(taskname);
    if (info != null) { return new Ender(info.runner, taskname); }
    return _nowaitFn;
  }

};

module.exports = grunseq;
