var SeqEngine=new function(){function n(n){return n in v}function t(){}function r(){console.log("SeqEngine = ["),y.forEach(function(n){console.log(n)}),console.log("  runned: "+JSON.stringify(v)),console.log("].")}function i(n){for(var t=0,r=y.length;r>t;t++)if(y[t].runner===n)return y[t];return null}function e(n){for(var t=0,r=y.length;r>t;t++){var i=y[t];if(n in i.running)return i}return null}function u(n,r){var i=new t,e={runner:i,tasks:n,running:{},callback:r};return y.unshift(e),e}function o(n){if(n.tasks.length>0)return!1;var t=y.indexOf(n);return t>=0&&y.splice(t,1),"function"==typeof n.callback&&n.callback(),!0}function f(n,t,r){return t in n.running?Object.keys(n.running[t]).length>0?!1:(delete n.running[t],"function"==typeof r&&r(),!0):!0}function c(n,t,r,i){for(var e=n.running[t],u=0,o=r.length;o>u;u++)e[r[u]]=i}function a(n,t,r,i,e){if("function"==typeof i&&i(),!(r in n.running[t]))return!1;var u=n.running[t][r];return delete n.running[t][r],f(n,t,function(){"function"==typeof u&&u(),"function"==typeof e&&e()}),!0}function s(t){if(!o(t)){var r=t.tasks.shift();Array.isArray(r)||(r=[r]);for(var i=[],e=0,u=r.length;u>e;e++){var f=r[e];"string"==typeof f&&(n(f)||(i.push(f),t.running[f]={}))}return 0===i.length?void s(t):void k.start.call(t.runner,i)}}function g(n,t){var r=u(n,t);return s(r),r}function l(n,t,r){f(n,t,r)&&0===Object.keys(n.running).length&&s(n)}function h(n,t,r,i,e){a(n,t,r,i,e)&&0===Object.keys(n.running).length&&s(n)}this.startTasks=g,this.endTask=l,this.waitTask=c,this.notifyTask=h,this.getInfoByRunner=i,this.getInfoByRunningTask=e,this.log=r;var k=require("gulp"),v={};k.on("task_start",function(n){v[n.task]=!0});var y=[];t.prototype=k};function Ender(n,t){function e(n){return"function"==typeof n[n.length-1]?n.pop():null}var o,i,f,u=SeqEngine.getInfoByRunningTask(n);if(null!=u)o=function(e){SeqEngine.endTask(u,n,function(){"function"==typeof e&&e(),"function"==typeof t&&t()})},i=function(){var t=Array.prototype.slice.call(arguments),i=e(t);return SeqEngine.waitTask(u,n,t,i),o},f=function(e,i){return SeqEngine.notifyTask(u,n,e,i,t),o};else{o=function(n){"function"==typeof n&&n(),"function"==typeof t&&t()};var r,c={};i=function(){var n=Array.prototype.slice.call(arguments);r=e(n);for(var t=0,i=n.length;i>t;t++)c[n[t]]=!0;return o},f=function(n,e){return"function"==typeof e&&e(),delete c[n],0===Object.keys(c).length&&("function"==typeof r&&r(),"function"==typeof t&&t()),o}}return o["with"]=function(n){return function(){o(n)}},o.wait=i,o.notify=f,o.notifier=function(n,t){return function(){f(n,t)}},o}!function(){var n=require("gulp"),r={},t=n.emit;n.emit=function(a,o){return o.task in r?!0:t.apply(n,arguments)};var a=n.task;n.task=function(t,o,e){function i(n){var r=33+Math.floor(94*Math.random()),t=33+Math.floor(94*Math.random()),a=String.fromCharCode(r)+String.fromCharCode(t);return a="[8m"+a+"[0m[2D",n+a}function u(t,o){r[t]=!0;var e=i(t),u=o.concat(e),f=function(n){SeqEngine.startTasks(u,new Ender(t,n))};return a.call(n,t,void 0,f),e}function f(n,r,t){var a=u(n,r);return c(a,void 0,t)}function c(r,t,o){var e;return e=o?0===o.length?function(n){var t=new Ender(r);o(),t(n)}:function(n){var t=new Ender(r,n);o(t)}:function(n){new Ender(r,n)()},a.call(n,r,t,e)}return Array.isArray(o)&&1===o.length&&Array.isArray(o[0])?f(t,o[0],e):(e||"function"!=typeof o||(e=o,o=void 0),c(t,o,e))}}();module.exports=require("gulp");