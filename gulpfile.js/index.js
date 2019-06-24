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
const MAX_NEWS_ON_INDEX = 6 // index页面显示的新闻数量
const MAX_NEWS_PER_PAGE = 3 // 新闻列表页每页显示的新闻数量
const news_list = JSON.parse(fs.readFileSync('./src/news/news_all_list.json'));

let news_jsons = []
let newsitem = null;

for(let id in news_list) {
    newsitem = JSON.parse(fs.readFileSync('./src/news/' + news_list[id] + '.json'))
    news_jsons.push({
        id: news_list[id],
        title: newsitem.title,
        preface: newsitem.preface,
        datetime: newsitem.datetime
    });
}
//
// 数据初始化部分，结束
//
// =============================================================================

// PUG模板文件生成HTML（index page）
function index2html() {
    // console.log(news_list);
    return src('src/*.pug')
    .pipe(pug({
        locals : { 
            data: { 
                newsjsons: news_jsons.slice(0, MAX_NEWS_ON_INDEX) 
            } 
        }
    }))
    .pipe(dest('dist/'));
}

// PUG模板文件生成HTML（新闻列表序列）
function newslist2html(cb) {
    const pagecount = Math.trunc((news_list.length - 1) / MAX_NEWS_PER_PAGE) + 1; // 获取新闻导航列表页的总页数。

    for(let id = 1; id <= pagecount; id ++) {
        src('src/news/news_list.pug')
        .pipe(pug({
            locals : { 
                data: {
                    currentpageno: id,
                    pagecount: pagecount,
                    newslist: news_jsons.slice((id - 1) * MAX_NEWS_PER_PAGE, id * MAX_NEWS_PER_PAGE)
                }
            }
        }))
        .pipe(rename({ basename: `news_list_${id}` }))
        .pipe(dest('dist/'));
        cb();
    }
}

// PUG模板文件生成HTML（新闻文档）
function news2html(cb) {
    const news_docs_generate_list = JSON.parse(fs.readFileSync('./src/news/news_docs_generate_list.json'));

    for(let id in news_docs_generate_list) {
        src('src/news/news_doc.pug')
        .pipe(pug({
            locals : { data: JSON.parse(fs.readFileSync('./src/news/' + news_docs_generate_list[id] + '.json')) }
        }))
        .pipe(rename({ basename: news_docs_generate_list[id] }))
        .pipe(dest('dist/'));
        cb();
    }
}

exports.news = parallel(index2html, news2html, newslist2html);
exports.all = parallel(babel2js, index2html, news2html, newslist2html);
exports.default = parallel(babel2js);
