const { src, dest, series, parallel } = require('gulp');
const babel = require('gulp-babel');
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const fs = require('fs');

// ===================================================================================================
//
//  公共基础函数部分，开始
//

//  json文件读取：读取指定json文件并返回对象
function get_jsondata(filepath) {
    return JSON.parse(fs.readFileSync(filepath));
}

//  mottos数据处理：读取并返回所有mottos数组
function get_mottos() {
    return get_jsondata('./src/mottos.json');
}

//  news数据处理：读取并返回所有新闻列表数组
function get_news_all_list() {
    return get_jsondata('./src/news/news_all_list.json');
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
        let read_news_list = news_all_list.slice(start, end);
        for(let id in read_news_list) {
            newsitem = get_jsondata('./src/news/' + read_news_list[id] + '.json');
            news_jsons.push({
                id: read_news_list[id],
                title: newsitem.title,
                preface: newsitem.preface,
                datetime: newsitem.datetime
            });
        }
    }
    return news_jsons;
}

//  about页面数据处理：返回about页面所需数据
function get_about_data() {
    let aboutjson = get_jsondata('./src/about.json');
    aboutjson.mottos = get_mottos();

    return aboutjson;
}

//  index页面数据处理：返回index页面所需数据
function get_index_data() {
    const MAX_NEWS_ON_INDEX = 6 // index页面显示的新闻数量

    let indexjson = {};
    indexjson.mottos = get_mottos();
    indexjson.newsjsons = get_news_jsons(get_news_all_list(), 0, MAX_NEWS_ON_INDEX);

    return indexjson;
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
    return src('src/index.pug')
    .pipe(pug({
        locals : { data: get_index_data() }
    }))
    .pipe(dest('dist/'));
}

// PUG模板文件生成HTML（about page）
function about2html() {
    // console.log(news_list);
    return src('src/about.pug')
    .pipe(pug({
        locals : { data: get_about_data() }
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
exports.all = parallel(babel2js, index2html, about2html, news2html, newslist2html);
exports.default = parallel(babel2js, index2html, about2html);
