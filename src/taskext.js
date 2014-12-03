var originalTaskFn = gulp.task;
gulp.task = function(name, dep, fn) {
  function start(){ TaskStatus.startTask(name); }
  var newFn;
  if (Array.isArray(dep) && dep.length === 1 && Array.isArray(dep[0])) {
    var taskseq = dep[0];
    if (!fn) {
      newFn = function() {
        var end = grunseq.ender(name);
        taskseq.push(function() { start(); end(); });
        grunseq.start.apply(grunseq, taskseq);
      };
    } else if (fn.length > 0) {
      newFn = function(cb) {
        var end = grunseq.ender(name);
        taskseq.push(function(cb) { start(); fn(end); fnCall(cb); });
        grunseq.start.apply(grunseq, taskseq);
      };
    } else {
      newFn = function() {
        var end = grunseq.ender(name);
        taskseq.push(function() { start(); fn(); end(); });
        grunseq.start.apply(grunseq, taskseq);
      };
    }
    return originalTaskFn.call(gulp, name, undefined, newFn);
  }

  if (!fn && (typeof(dep) === 'function')) { fn = dep; dep = undefined; }

  if (dep == null || dep.length === 0) {
    if (!fn) {
      newFn = function() {
        var end = grunseq.ender(name);
        start(); end();
      };
    } else if (fn.length > 0) {
      newFn = function(cb) {
        var end = grunseq.ender(name);
        start(); fn(end); fnCall(cb);
      };
    } else {
      newFn = function() {
        var end = grunseq.ender(name);
        start(); fn(); end();
      };
    }
    return originalTaskFn.call(gulp, name, dep, newFn);
  }
  else {
    var taskseq2 = [dep];
    if (!fn) {
      newFn = function() {
        var end = grunseq.ender(name);
        taskseq2.push(function() { start(); end(); });
        grunseq.start.apply(grunseq, taskseq2);
      };
    } else if (fn.length > 0) {
      newFn = function(cb) {
        var end = grunseq.ender(name);
        taskseq2.push(function(cb) { start(); fn(end); fnCall(cb); });
        grunseq.start.apply(grunseq, taskseq2);
      };
    } else {
      newFn = function(cb) {
        var end = grunseq.ender(name);
        taskseq2.push(function() { start(); fn(); end(); });
        grunseq.start.apply(grunseq, taskseq2);
      };
    }
    return originalTaskFn.call(gulp, name, undefined, newFn);
  }
};
