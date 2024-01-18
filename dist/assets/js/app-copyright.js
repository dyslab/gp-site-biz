"use strict";

var sitename = 'Gulp Demo Site 演示网站';
var fromyear = 2018;
var toyear = new Date().getFullYear();
document.write('<div class="am-g am-g-fixed am-padding-vertical-lg am-footer-default"><hr><center>');
document.write("<div class=\"am-footer-miscs\"><i class=\"am-icon-copyright\"></i> ".concat(fromyear, " - ").concat(toyear, " <a href=\"./\">").concat(sitename, "</a> \u7248\u6743\u6240\u6709<br></div>"));
document.write('<div class="am-footer-miscs"><small>Powered by' + ' <a href="https://amazeui.shopxo.net/" target="_blank">Amaze UI</a>,' + ' <a href="https://gulpjs.com" target="_blank">Gulp</a>, Supported by' + ' <a href="https://jquery.com/" target="_blank">jQuery</a>,' + ' <a href="http://nodejs.cn/" target="_blank">node.js</a>.' + '</small></div>');
document.write('</center></div>');