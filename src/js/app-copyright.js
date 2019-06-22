const sitename = 'Gulp Demo Site 演示网站';
const fromyear = 2018;
const toyear = (new Date()).getFullYear();

document.write('<hr><center>');
document.write(`${sitename} <span style="color: #999;">版权所有。 &copy; ${fromyear} - ${toyear}</span><br>`);
document.write(
    '<small><span style="color: #999;">Powered by ' +
    '<a href="http://amazeui.org" target="_blank">Amaze UI</a>,' +
    '<a href="https://gulpjs.com" target="_blank">Gulp</a>, Supported by ' +
    '<a href="https://jquery.com/" target="_blank">jQuery</a>,' +
    '<a href="http://nodejs.cn/" target="_blank">node.js</a>.' +
    '</span></small>'
);
document.write('</center>');
