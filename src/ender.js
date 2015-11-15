function _noop() {}

function _popCallback(keys) {
  return (typeof(keys[keys.length -1]) === 'function') ? keys.pop() : null;
}

function _makeEndCallback(endFn, endArg, taskCb) {
  if (endFn == null) { endFn = _noop; }
  if (endArg == null) {
    return function() { endFn(); taskCb(); return true; };
  } else {
    return function() { endFn(); taskCb(endArg); return false; };
  }
}

function _makePassCallback(endFn, endArg, taskCb) {
  if (endFn == null) { endFn = _noop; }
  return function() { endFn(); taskCb(); return true; };
}

function _makeAbortCallback(endFn, endArg, taskCb) {
  if (endFn == null) { endFn = _noop; }
  if (endArg == null) { endArg = new Error('Abort.'); }
  return function() { endFn(); taskCb(endArg); return false; };
}

function Ender(taskname, taskCb) {
  if (typeof(taskCb) !== 'function') { taskCb = _noop; }

  var _ender, _wait, _ntf, _abort, _pass;
  var info = SeqEngine.getInfoByRunningTask(taskname);
  if (info != null) {
    _ender = function(arg) {
      if (typeof(arg) === 'function') {
        SeqEngine.endTask(info, taskname, _makeEndCallback(arg, null, taskCb));
      } else {
        SeqEngine.endTask(info, taskname, _makeEndCallback(null, arg, taskCb));
      }
    };
    _pass = function(fn) {
      return function(arg) {
        SeqEngine.endTask(info, taskname, _makePassCallback(fn, arg, taskCb));
      };
    };
    _abort = function(fn) {
      return function(arg) {
        SeqEngine.endTask(info, taskname, _makeAbortCallback(fn, arg, taskCb));
      };
    };
    _wait = function(/*...keys [, cb]*/) {
      var keys = Array.prototype.slice.call(arguments);
      var cb = _popCallback(keys);
      SeqEngine.waitTask(info, taskname, keys, cb);
      return _ender;
    };
    _ntf = function(key, cb) {
      SeqEngine.notifyTask(info, taskname, key, cb, taskCb);
      return _ender;
    };
  } else {
    var _waitKeys = {}, _waitCb;

    _ender = function(arg) {
      if (typeof(arg) === 'function') {
        (_makeEndCallback(arg, null, taskCb))();
      } else {
        (_makeEndCallback(null, arg, taskCb))();
      }
    };
    _pass = function(fn) {
      return function(arg) { (_makePassCallback(fn, arg, taskCb))(); };
    };
    _abort = function(fn) {
      return function(arg) { (_makeAbortCallback(fn, arg, taskCb))(); };
    };
    _wait = function() {
      var keys = Array.prototype.slice.call(arguments);
      _waitCb = _popCallback(keys);
      for (var i=0, n=keys.length; i<n; i++) { _waitKeys[keys[i]] = true; }
      return _ender;
    };
    _ntf = function(key, cb) {
      if (typeof(cb) === 'function') { cb(); }
      delete _waitKeys[key];
      if (Object.keys(_waitKeys).length === 0) {
        if (typeof(_waitCb) === 'function') { _waitCb(); }
        taskCb();
      }
      return _ender;
    };
  }

  _ender.with = function(cb) { return function() { _ender(cb); }; };
  _ender.pass = _pass;
  _ender.abort = _abort;
  _ender.wait = _wait;
  _ender.notify = _ntf;
  _ender.notifier = function(key,cb) { return function() { _ntf(key,cb); }; };

  return _ender;
}
