const sitename = 'Gulp Demo Site 演示网站';
const fromyear = 2018;
const toyear = (new Date()).getFullYear();

document.write('<div class="am-g am-g-fixed am-padding-vertical-lg am-footer-default"><hr><center>');
document.write(`<div class="am-footer-miscs"><i class="am-icon-copyright"></i> ${fromyear} - ${toyear} <a href="./">${sitename}</a> 版权所有<br></div>`);
document.write(
    '<div class="am-footer-miscs"><small>Powered by' +
    ' <a href="https://amazeui.shopxo.net/" target="_blank">Amaze UI</a>,' +
    ' <a href="https://gulpjs.com" target="_blank">Gulp</a>, Supported by' +
    ' <a href="https://jquery.com/" target="_blank">jQuery</a>,' +
    ' <a href="http://nodejs.cn/" target="_blank">node.js</a>.' +
    '</small></div>'
);
document.write('</center></div>');
