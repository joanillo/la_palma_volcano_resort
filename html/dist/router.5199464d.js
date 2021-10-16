parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"hPM2":[function(require,module,exports) {
"use strict";function t(t){var e=this._getSettings(t);if(this.notFoundHandler=e.page404,this.mode=window.history&&window.history.pushState?e.mode:"hash",this.root="/"===e.root?"/":"/"+this._trimSlashes(e.root)+"/",this.beforeHook=e.hooks.before,this.securityHook=e.hooks.secure,this.routes=[],e.routes&&e.routes.length>0){var r=this;e.routes.forEach(function(t){r.add(t.rule,t.handler,t.options)})}return this._pageState=null,this._currentPage=null,this._skipCheck=!1,this._action=null,"hash"===this.mode&&(this._historyStack=[],this._historyIdx=0,this._historyState="add"),this}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0,t.Page=function(t,e,r,o,i){this.uri=t||"",this.query=e||{},this.params=r||[],this.state=o||null,this.options=i||{}},t.prototype._getSettings=function(t){var e={},r={routes:[],mode:"history",root:"/",hooks:{before:function(){},secure:function(){return!0}},page404:function(t){console.error({page:t,message:"404. Page not found"})}};return t=t||{},["routes","mode","root","page404"].forEach(function(o){e[o]=t[o]||r[o]}),e.hooks=Object.assign({},r.hooks,t.hooks||{}),e},t.prototype._getHistoryFragment=function(){var t=decodeURI(window.location.pathname);return"/"!==this.root&&(t=t.replace(this.root,"")),this._trimSlashes(t)},t.prototype._getHashFragment=function(){var t=window.location.hash.substr(1).replace(/(\?.*)$/,"");return this._trimSlashes(t)},t.prototype._getFragment=function(){return"history"===this.mode?this._getHistoryFragment():this._getHashFragment()},t.prototype._trimSlashes=function(t){return"string"!=typeof t?"":t.toString().replace(/\/$/,"").replace(/^\//,"")},t.prototype._page404=function(e){this._currentPage=new t.Page(e),this.notFoundHandler(e)},t.prototype._parseRouteRule=function(t){if("string"!=typeof t)return t;var e=this._trimSlashes(t).replace(/([\\\/\-\_\.])/g,"\\$1").replace(/\{[a-zA-Z]+\}/g,"(:any)").replace(/\:any/g,"[\\w\\-\\_\\.]+").replace(/\:word/g,"[a-zA-Z]+").replace(/\:num/g,"\\d+");return new RegExp("^"+e+"$","i")},t.prototype._parseQuery=function(t){var e={};return"string"!=typeof t?e:("?"===t[0]&&(t=t.substr(1)),this._queryString=t,t.split("&").forEach(function(t){var r=t.split("=");""!==r[0]&&(void 0===r[1]&&(r[1]=!0),e[decodeURIComponent(r[0])]=r[1])}),e)},t.prototype._getHistoryQuery=function(){return this._parseQuery(window.location.search)},t.prototype._getHashQuery=function(){var t=window.location.hash.indexOf("?"),e=-1!==t?window.location.hash.substr(t):"";return this._parseQuery(e)},t.prototype._getQuery=function(){return"history"===this.mode?this._getHistoryQuery():this._getHashQuery()},t.prototype.add=function(t,e,r){return this.routes.push({rule:this._parseRouteRule(t),handler:e,options:r}),this},t.prototype.remove=function(t){var e=this;return"string"==typeof t&&(t=this._parseRouteRule(t).toString()),this.routes.some(function(r,o){return(r.handler===t||r.rule.toString()===t)&&(e.routes.splice(o,1),!0)}),this},t.prototype.reset=function(){return this.routes=[],this.mode=null,this.root="/",this._pageState={},this.removeUriListener(),this},t.prototype._pushHistory=function(){var t=this._getFragment();"hash"===this.mode&&("add"===this._historyState&&(this._historyIdx!==this._historyStack.length-1&&this._historyStack.splice(this._historyIdx+1),this._historyStack.push({path:t,state:this._pageState}),this._historyIdx=this._historyStack.length-1),this._historyState="add")},t.prototype._unloadCallback=function(t){var e;return this._skipCheck?!t||Promise.resolve(!0):this._currentPage&&this._currentPage.options&&this._currentPage.options.unloadCb?(e=this._currentPage.options.unloadCb(this._currentPage,t),!t||e instanceof Promise?e:e?Promise.resolve(e):Promise.reject(e)):!t||Promise.resolve(!0)},t.prototype._findRoute=function(){var e=this,r=this._getFragment();return this.routes.some(function(o){var i=r.match(o.rule);if(i){i.shift();var s=e._getQuery(),n=new t.Page(r,s,i,e._pageState,o.options);return!!e.securityHook(n)&&(e._currentPage=n,e._skipCheck?(e._skipCheck=!1,!0):(e.beforeHook(n),o.handler.apply(n,i),e._pageState=null,window.onbeforeunload=function(t){if(!e._unloadCallback(!1))return t.returnValue=!0,!0},!0))}return!1})},t.prototype._treatAsync=function(){var t;(t=this._currentPage.options.unloadCb(this._currentPage,!0))instanceof Promise||(t=t?Promise.resolve(t):Promise.reject(t)),t.then(this._processUri.bind(this)).catch(this._resetState.bind(this))},t.prototype._resetState=function(){this._skipCheck=!0,this.navigateTo(this._current,this._currentPage.state,!0)},t.prototype._processUri=function(){var t=this._getFragment();this._current=t,this._pushHistory(),this._findRoute.call(this)||this._page404(t)},t.prototype.check=function(){return this._skipCheck?this:(this._currentPage&&this._currentPage.options&&this._currentPage.options.unloadCb?this._treatAsync():this._processUri(),this)},t.prototype.addUriListener=function(){return"history"===this.mode?window.onpopstate=this.check.bind(this):window.onhashchange=this.check.bind(this),this},t.prototype.removeUriListener=function(){return window.onpopstate=null,window.onhashchange=null,this},t.prototype.redirectTo=function(t,e,r){return t=this._trimSlashes(t)||"",this._pageState=e||null,this._skipCheck=!!r,"history"===this.mode?(history.replaceState(e,null,this.root+this._trimSlashes(t)),this.check()):(this._historyIdx--,window.location.hash=t,this)},t.prototype.navigateTo=function(t,e,r){return t=this._trimSlashes(t)||"",this._pageState=e||null,this._skipCheck=!!r,"history"===this.mode?(history.pushState(e,null,this.root+this._trimSlashes(t)),this.check()):(window.location.hash=t,this)},t.prototype.refresh=function(){if(!this._currentPage)return this;var t=this._currentPage.uri+"?"+this._queryString;return this.navigateTo(t,this._currentPage.state)},t.prototype.back=function(){return"history"===this.mode?(window.history.back(),this):this.go(this._historyIdx-1)},t.prototype.forward=function(){return"history"===this.mode?(window.history.forward(),this):this.go(this._historyIdx+1)},t.prototype.go=function(t){if("history"===this.mode)return window.history.go(t),this;var e=this._historyStack[t];return e?(this._historyIdx=t,this._historyState="hold",this.navigateTo(e.path,e.state)):this};var e=t;exports.default=e;
},{}]},{},["hPM2"], null)
//# sourceMappingURL=router.5199464d.js.map