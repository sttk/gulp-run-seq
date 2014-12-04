function Ender(taskname) {
  function _popCallback(keys) {
    return (typeof(keys[keys.length -1]) === 'function') ? keys.pop() : null;
  }

  var _ender, _wait, _ntf;
  var info = SeqEngine.getInfoByRunningTask(taskname);
  if (info != null) {
    _ender = function(cb) { SeqEngine.endTask(info, taskname, cb); };
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
    _ender = function(cb) { if (typeof(cb) === 'function') { cb(); } };
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
