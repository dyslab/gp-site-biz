const { src, dest, series, parallel } = require('gulp');
const babel = require('gulp-babel');
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const fs = require('fs');

// ===================================================================================================
//
//  公共基础函数部分，开始
//

//  news数据处理：读取并返回所有需要显示的新闻列表数组
function get_news_all_list() {
    return JSON.parse(fs.readFileSync('./src/news/news_all_list.json'));
}

//  news数据处理：从news json文件读取所需的news内容列表并返回
//  参数：
//      news_all_list: 所有需要显示的新闻列表数组，由'./src/news/news_all_list.json'读取。
//      start： 新闻列表读取开始位置
//      end： 新闻列表读取结束位置（不包括）
function get_news_jsons(news_all_list, start, end) {
    let news_jsons = [];
    if(start >= 0 && start < end) {
        let newsitem = null;
        let read_news_list = news_all_list.slice(start, end)
        for(let id in read_news_list) {
            newsitem = JSON.parse(fs.readFileSync('./src/news/' + read_news_list[id] + '.json'))
            news_jsons.push({
                id: read_news_list[id],
                title: newsitem.title,
                preface: newsitem.preface,
                datetime: newsitem.datetime
            });
        }
    }
    return news_jsons
}

//
//  公共基础函数部分，结束
//
// ===================================================================================================

// ===================================================================================================
//
//  Task函数部分，开始
//

// PUG模板文件生成HTML（index page）
function index2html() {
    const MAX_NEWS_ON_INDEX = 6 // index页面显示的新闻数量
    const news_jsons = get_news_jsons(get_news_all_list(), 0, MAX_NEWS_ON_INDEX);

    // console.log(news_list);
    return src('src/*.pug')
    .pipe(pug({
        locals : { 
            data: { 
                newsjsons: news_jsons
            } 
        }
    }))
    .pipe(dest('dist/'));
}

// PUG模板文件生成HTML（新闻列表序列）
function newslist2html(cb) {
    const MAX_NEWS_PER_PAGE = 3 // 新闻列表页每页显示的新闻数量
    const news_all_list = get_news_all_list();
    const pagecount = Math.trunc((news_all_list.length - 1) / MAX_NEWS_PER_PAGE) + 1; // 获取新闻导航列表页的总页数。

    for(let id = 1; id <= pagecount; id ++) {
        src('src/news/news_list.pug')
        .pipe(pug({
            locals : { 
                data: {
                    currentpageno: id,
                    pagecount: pagecount,
                    newslist: get_news_jsons(news_all_list, (id - 1) * MAX_NEWS_PER_PAGE, id * MAX_NEWS_PER_PAGE)
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

// 处理客户端JS文件
function babel2js() {
    return src('src/js/*.js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(dest('dist/assets/js/'));
}

//
//  Task函数部分，结束
//
// ===================================================================================================

exports.news = parallel(index2html, news2html, newslist2html);
exports.all = parallel(babel2js, index2html, news2html, newslist2html);
exports.default = parallel(babel2js, index2html);
