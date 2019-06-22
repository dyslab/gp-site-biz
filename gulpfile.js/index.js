const { src, dest, series, parallel } = require('gulp');
const babel = require('gulp-babel');
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const fs = require('fs');

// 处理客户端JS文件
function babel2js() {
    return src('src/js/*.js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(dest('dist/assets/js/'));
}
  
// 处理PUG模板文件（index.pug）
function index2html() {
    return src('src/*.pug')
    .pipe(pug())
    .pipe(dest('dist/'));
}

// ----------------------------------------------------------
//
// news部分开始
//
const news_list = JSON.parse(fs.readFileSync('./src/news/news_list.json'));

// 处理PUG模板文件（news）
function news2html(cb) {
    for(id in news_list) {
        src('src/news/news_doc.pug')
        .pipe(pug({
            data : { data: JSON.parse(fs.readFileSync('./src/news/' + news_list[id] + '.json')) }
        }))
        .pipe(rename({ basename: news_list[id] }))
        .pipe(dest('dist/'));
        cb();
    }
}
//
// news部分结束
//
// ----------------------------------------------------------

exports.default = parallel(babel2js, index2html, news2html);
