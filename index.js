var SeqEngine=new function(){function n(n){return n in v}function t(){}function r(){console.log("SeqEngine = ["),y.forEach(function(n){console.log(n)}),console.log("  runned: "+JSON.stringify(v)),console.log("].")}function i(n){for(var t=0;t<y.length;t++)if(y[t].runner===n)return y[t];return null}function e(n){for(var t=0;t<y.length;t++){var r=y[t];if(n in r.running)return r}return null}function u(n,r){var i=new t,e={runner:i,tasks:n,running:{},callback:r};return y.unshift(e),e}function o(n){if(n.tasks.length>0)return!1;var t=y.indexOf(n);return t>=0&&y.splice(t,1),"function"==typeof n.callback&&n.callback(n.argument),!0}function f(n,t,r){return t in n.running?Object.keys(n.running[t]).length>0?!1:(delete n.running[t],"function"==typeof r&&r(),!0):!1}function a(n,t,r,i){for(var e=n.running[t],u=0;u<r.length;u++)e[r[u]]=i}function s(n,t,r,i){if("function"==typeof i&&i(),r in n.running[t]){var e=n.running[t][r];return delete n.running[t][r],f(n,t,e),!0}return!1}function c(t){if(!o(t)){var r=t.tasks.shift();Array.isArray(r)||(r=[r]);for(var i=[],e=0;e<r.length;e++){var u=r[e];"string"==typeof u&&(n(u)||(i.push(u),t.running[u]={}))}return 0===i.length?void c(t):void k.start.call(t.runner,i)}}function g(n,t){var r=u(n,t);return c(r),r}function l(n,t,r){f(n,t,r)&&0===Object.keys(n.running).length&&c(n)}function h(n,t,r,i){s(n,t,r,i)&&0===Object.keys(n.running).length&&c(n)}this.startTasks=g,this.endTask=l,this.waitTask=a,this.notifyTask=h,this.getInfoByRunner=i,this.getInfoByRunningTask=e,this.log=r;var k=require("gulp"),v={};k.on("task_start",function(n){v[n.task]=!0});var y=[];t.prototype=k};function Ender(n,t){function o(n){return"function"==typeof n[n.length-1]?n.pop():null}var e,i,u,r=SeqEngine.getInfoByRunningTask(n);return null!=r?(e=function(o){var e=function(){"function"==typeof o&&o(),"function"==typeof t&&t()};SeqEngine.endTask(r,n,e)},i=function(){var t=Array.prototype.slice.call(arguments),i=o(t);return SeqEngine.waitTask(r,n,t,i),e},u=function(t,o){return SeqEngine.notifyTask(r,n,t,o),e}):(e=function(n){"function"==typeof n&&n(),"function"==typeof t&&t()},i=function(){var n=Array.prototype.slice.call(arguments),t=o(n);return null!=t&&t(),e},u=function(n,t){return"function"==typeof t&&t(),e}),e.with=function(n){return function(){e(n)}},e.wait=i,e.notify=u,e.notifier=function(n,t){return function(){u(n,t)}},e}!function(){var n=require("gulp"),r={},t=n.emit;n.emit=function(a,o){return o.task in r?!0:t.apply(n,arguments)};var a=n.task;n.task=function(t,o,e){function i(n){var r=33+Math.floor(94*Math.random()),t=33+Math.floor(94*Math.random()),a=String.fromCharCode(r)+String.fromCharCode(t);return a="[8m"+a+"[0m[2D",n+a}function u(t,o){r[t]=!0;var e=i(t),u=o.concat(e),f=function(n){SeqEngine.startTasks(u,new Ender(t,n))};return a.call(n,t,void 0,f),e}function f(n,r,t){var a=u(n,r);return c(a,void 0,t)}function c(r,t,o){var e;return e=o?0===o.length?function(n){var t=new Ender(r);o(),t(n)}:function(n){var t=new Ender(r,n);o(t)}:function(n){new Ender(r,n)()},a.call(n,r,t,e)}!function(){return Array.isArray(o)&&1===o.length&&Array.isArray(o[0])?f(t,o[0],e):(e||"function"!=typeof o||(e=o,o=void 0),c(t,o,e))}()}}();