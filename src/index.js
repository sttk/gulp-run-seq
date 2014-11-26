'use strict';
/*jshint eqnull:true, supernew:true, node:true */

var gulp = require('gulp');

var grunseq = new function() {

  this.start = _start;
  this.ender = _ender;


  var _runInfos = [];

  function Runner() {}
  Runner.prototype = gulp;

  function _findInfoByRunner(runner) {
    for (var i=0; i<_runInfos.length; i++) {
      if (_runInfos[i].runner === runner) { return _runInfos[i]; }
    }
    return null;
  }

  function _findInfoByRunnedTask(taskname) {
    for (var i=0; i<_runInfos.length; i++) {
      var info = _runInfos[i];
      if (info.runner.seq.indexOf(taskname) >= 0) { return info; }
    }
    return null;
  }

  function _clearInfo(info) {
    var idx = _runInfos.indexOf(info);
    if (idx >= 0) { _runInfos.splice(idx, 1); }
  }

  function _isEmpty(obj) {
    return (Object.keys(obj).length === 0);
  }


  function _start(/*...tasknames [, callback]*/) {
    var args = Array.prototype.slice.call(arguments);
    var cb = null;
    if (args.length > 0 && typeof(args[args.length - 1]) === 'function') {
      cb = args.pop();
    }

    var runner = new Runner();
    var tasknames = args;
    var info = { 'runner': runner, 'tasks': tasknames, 'running': {},
      'callback': cb };
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
      if (_findInfoByRunnedTask(taskname) != null) { continue; }
      parallels.push(taskname);
      info.running[taskname] = {};
    }
    gulp.start.apply(info.runner, parallels);
  }

  var _emptyFn = function() {};

  function Ender(runner, taskname) {
    var _endFn = function(cb) {
      var info = _findInfoByRunner(runner);
      if (info == null) { return; }
      if (!(taskname in info.running)) { return; }

      if (_isEmpty(info.running[taskname])) {
        delete info.running[taskname];
        if (typeof(cb) === 'function') { cb(true); }
        if (_isEmpty(info.running)) { _next(info); }
      }
    };
    _endFn.wait = function(/*...keys [, callback]*/) {
      var info = _findInfoByRunner(runner);
      if (info == null) { return; }

      var keys = Array.prototype.slice.call(arguments);
      var waitcb = _emptyFn;
      if (keys.length > 0 && typeof(keys[keys.length - 1]) === 'function') {
        waitcb = keys.pop();
      }
      if (!(taskname in info.running)) { return; }

      var obj = info.running[taskname];
      for (var i=0; i<keys.length; i++) { obj[keys[i]] = waitcb; }
      return _endFn;
    };
    _endFn.notify = function(key, cb) {
      var info = _findInfoByRunner(runner);
      if (info == null) { return; }

      if (!(taskname in info.running)) { return; }

      var waitcb = _emptyFn;
      if (key in info.running[taskname]) {
        waitcb = info.running[taskname][key];
        delete info.running[taskname][key];
      }
      if (_isEmpty(info.running[taskname])) { delete info.running[taskname]; }
      if (cb != null) { cb(true); }
      if (_isEmpty(info.running)) { waitcb(true); _next(info); }
      return _endFn;
    };
    return _endFn;
  }

  var _nowaitFn = new function() {
    var _endFn = function(cb) {
      if (typeof(cb) === 'function') { cb(false); }
    };
    _endFn.wait = function() {
      var keys = Array.prototype.slice.call(arguments);
      if (keys.length > 0 && typeof(keys[keys.length - 1]) === 'function') {
        var fn = keys[keys.length - 1];
        fn(false);
      }
      return _endFn;
    };
    _endFn.notify = function(key, cb) {
      if (cb != null) { cb(false); }
      return _endFn;
    };
    return _endFn;
  };

  function _ender(taskname) {
    var info = _findInfoByRunnedTask(taskname);
    if (info != null) { return new Ender(info.runner, taskname); }
    return _nowaitFn;
  }

};

module.exports = grunseq;
