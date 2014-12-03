function Ender(info, taskname) {
  var _lastErr = null;
  var _ender = function(cb, err) {
    TaskManager.endTask(info, taskname, cb, err);
  };
  _ender.with = function(cb) {
    return function(err) { _ender(cb, err); };
  };
  _ender.wait = function(/*...keys [, cb]*/) {
    var keys = Array.prototype.slice.call(arguments);
    var cb = popLastCallback(keys);
    TaskManager.waitTask(info, taskname, keys, cb);
    return _ender;
  };
  function _notify(key, cb, err) {
    if (err) { _lastErr = err; }
    TaskManager.notifyTask(info, taskname, key, cb, _lastErr, err);
    return _ender;
  }
  _ender.notify = _notify;
  _ender.notifier = function(key, callback) {
    return function(err) { return _notify(key, callback, err); };
  };
  return _ender;
}

function NoWaitEnder(taskname) {
  var _ender = function(callback, err) {
    TaskStatus.endTask(taskname, callback, err, false);
  };
  _ender.with = function(cb) {
    return function(err) { _ender(cb, err); };
  };
  _ender.wait = function(/*...keys [, cb]*/) {
    var keys = Array.prototype.slice.call(arguments);
    var cb = popLastCallback(keys);
    cb(false);
    return _ender;
  };
  function _notify(key, cb, err) {
    fnCall(cb, false, err);
    return _ender;
  }
  _ender.notify = _notify;
  _ender.notifier = function(key, cb) {
    return function(err) { return _notify(key, cb, err); };
  };
  return _ender;
}
