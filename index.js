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
    console.log('  runned: ' + JSON.stringify(_runned));
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
    if (taskset.length === 0) { _nextTasks(info); return; }
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

function Ender(taskname, taskCb) {
  function _popCallback(keys) {
    return (typeof(keys[keys.length -1]) === 'function') ? keys.pop() : null;
  }

  var _ender, _wait, _ntf;
  var info = SeqEngine.getInfoByRunningTask(taskname);
  if (info != null) {
    _ender = function(cb) {
      var f = function() {
        if (typeof(cb) === 'function') { cb(); }
        if (typeof(taskCb) === 'function') { taskCb(); }
      };
      SeqEngine.endTask(info, taskname, f);
    };
    _wait = function(/*...keys [, cb]*/) {
      var keys = Array.prototype.slice.call(arguments);
      var cb = _popCallback(keys);
      SeqEngine.waitTask(info, taskname, keys, cb);
      return _ender;
    };
    _ntf = function(key, cb) {
      SeqEngine.notifyTask(info, taskname, key, cb);
      return _ender;
    };
  } else {
    _ender = function(cb) {
      if (typeof(cb) === 'function') { cb(); }
      if (typeof(taskCb) === 'function') { taskCb(); }
    };
    _wait = function() {
      var keys = Array.prototype.slice.call(arguments);
      var cb = _popCallback(keys);
      if (cb != null) { cb(); }
      return _ender;
    };
    _ntf = function(key, cb) {
      if (typeof(cb) === 'function') { cb(); }
      return _ender;
    };
  }

  _ender.with = function(cb) { return function() { _ender(cb); }; };
  _ender.wait = _wait;
  _ender.notify = _ntf;
  _ender.notifier = function(key,cb) { return function() { _ntf(key,cb); }; };

  return _ender;
}

(function() {

var gulp = require('gulp');

var _seqStartTasks = {};
var originalEmit = gulp.emit;
gulp.emit = function(event, args) {
  if (args.task in _seqStartTasks) { return true; }
  return originalEmit.apply(gulp, arguments);
};

var originalTask = gulp.task;
gulp.task = function(name, dep, fn) {

  function _runCb(cb) {
    if (typeof(cb) === 'function') { cb(); }
  }

  function _newName(name) {
    var n1 = 33 + Math.floor((126-32) * Math.random());
    var n2 = 33 + Math.floor((126-32) * Math.random());
    var suffix = String.fromCharCode(n1) + String.fromCharCode(n2);
    suffix = '\u001B[8m' + suffix +'\u001B[0m\u001B[2D'; //hidden
    return name + suffix;
  }

  function _defineSeqStartTask(name, dep) {
    _seqStartTasks[name] = true;
    var newName = _newName(name);
    var newDep = dep.concat(newName);
    var fn = function(cb) {
      SeqEngine.startTasks(newDep, new Ender(name, cb));
    };
    originalTask.call(gulp, name, undefined, fn);
    return newName;
  }

  function _createSeqTask(name, dep, fn) {
    var newName = _defineSeqStartTask(name, dep);
    return _createTask(newName, undefined, fn);
  }

  function _createTask(name, dep, fn) {
    var newFn;
    if (!fn) {
      newFn = function(cb) { (new Ender(name, cb))(); };
    } else if (fn.length === 0) {
      newFn = function(cb) { var end = new Ender(name); fn(); end(cb); };
    } else {
      newFn = function(cb) { var end = new Ender(name, cb); fn(end); };
    }
    return originalTask.call(gulp, name, dep, newFn);
  }

  (function(){
    if (Array.isArray(dep) && dep.length === 1 && Array.isArray(dep[0])) {
      return _createSeqTask(name, dep[0], fn);
    } else {
      if (!fn && (typeof(dep) === 'function')) { fn = dep; dep = undefined; }
      return _createTask(name, dep, fn);
    }
  }());
};

}());
