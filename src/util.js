var EMPTY_FN = function(){};

var isEmptyObject = function(obj) { return (Object.keys(obj).length === 0); };

function popLastCallback(args) {
  if (args.length === 0 || typeof(args[args.length - 1]) !== 'function') {
    return EMPTY_FN;
  } else {
    return args.pop();
  }
}

function fnCall(f) {
  var args = Array.prototype.slice.call(arguments, 1);
  if (typeof(f) === 'function') { f.apply(null, args); }
}
