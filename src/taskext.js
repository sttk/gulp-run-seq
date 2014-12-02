var originalTaskFn = gulp.task;
gulp.task = function(name, dep, fn) {
  var newDep, newFn;
  if (Array.isArray(dep) && dep.length === 1 && Array.isArray(dep[0])) {
    var taskseq = dep[0];
    if (!fn) {
      newFn = function() {
        var end = grunseq.ender(name);
        taskseq.push(function() { end(); });
        grunseq.start.apply(grunseq, taskseq);
      };
    } else if (fn.length > 0) {
      newFn = function(cb) {
        var end = grunseq.ender(name);
        taskseq.push(function(cb) { fn(end); fnCall(cb); });
        grunseq.start.apply(grunseq, taskseq);
      };
    } else {
      newFn = function() {
        var end = grunseq.ender(name);
        taskseq.push(function() { fn(); end(); });
        grunseq.start.apply(grunseq, taskseq);
      };
    }
  } else {
    if (!fn && (typeof(dep) === 'function')) { fn = dep; dep = undefined; }
    newDep = dep;
    if (!fn) {
      newFn = function() { grunseq.ender(name)(); };
    } else if (fn.length > 0) {
      newFn = function(cb) { fn(grunseq.ender(name)); fnCall(cb); };
    } else {
      newFn = function() { fn(); grunseq.ender(name)(); };
    }
  }
  return originalTaskFn.call(gulp, name, newDep, newFn);
};
