var gulp = require('gulp');

var grunseq = new function() {
  this.start = _start;
  this.ender = _ender;

  function _start(/*...tasknames [, callback]*/) {
    var args = Array.prototype.slice.call(arguments);
    var cb = popLastCallback(args);
    TaskManager.startTasks(args, cb);
  }

  function _ender(taskname) {
    var info = TaskManager.getInfoByRunningTask(taskname);
    if (info != null) {
      return new Ender(info, taskname);
    } else {
      return new NoWaitEnder(taskname);
    }
  }
};

module.exports = grunseq;
