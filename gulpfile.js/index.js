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
  
// =============================================================================
//
// Pug数据初始化部分，开始
//
// news数据处理：从json文件读取news列表
const news_list = JSON.parse(fs.readFileSync('./src/news/news_list.json'));
let news_jsons = []
for(id in news_list) {
    let newsitem = JSON.parse(fs.readFileSync('./src/news/' + news_list[id] + '.json'))
    newsitem.id = news_list[id]
    news_jsons.push(newsitem);
}
//
// 数据初始化部分，结束
//
// =============================================================================

// 处理PUG模板文件（index.pug）
function index2html() {
    // console.log(news_list);
    return src('src/*.pug')
    .pipe(pug({
        locals : { data: { newsjsons: news_jsons.slice(0, 6) } }
    }))
    .pipe(dest('dist/'));
}

// 处理PUG模板文件（news）
function news2html(cb) {
    for(id in news_list) {
        src('src/news/news_doc.pug')
        .pipe(pug({
            locals : { data: news_jsons[id] }
        }))
        .pipe(rename({ basename: news_list[id] }))
        .pipe(dest('dist/'));
        cb();
    }
}

exports.default = parallel(babel2js, index2html, news2html);
