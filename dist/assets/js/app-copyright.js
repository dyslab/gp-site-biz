"use strict";

var sitename = 'Gulp Demo Site 演示网站';
var fromyear = 2018;
var toyear = new Date().getFullYear();
document.write('<div class="am-g am-g-fixed"><hr><center>');
document.write("<a class=\"am-link-muted\" href=\"./\">".concat(sitename, "</a> <span style=\"color: #999;\">\u7248\u6743\u6240\u6709\u3002 &copy; ").concat(fromyear, " - ").concat(toyear, "</span><br>"));
document.write('<small><span style="color: #999;">Powered by ' + '<a class="am-link-muted" href="http://amazeui.org" target="_blank">Amaze UI</a>,' + '<a class="am-link-muted" href="https://gulpjs.com" target="_blank">Gulp</a>, Supported by ' + '<a class="am-link-muted" href="https://jquery.com/" target="_blank">jQuery</a>,' + '<a class="am-link-muted" href="http://nodejs.cn/" target="_blank">node.js</a>.' + '</span></small>');
document.write('</center></div>');