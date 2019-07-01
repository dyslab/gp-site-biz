const { src, dest, series, parallel } = require('gulp');
const babel = require('gulp-babel');
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const fs = require('fs');

// ===================================================================================================
//
//  公共基础函数部分，开始
//

//  json文件读取（含异常处理）：读取指定json文件并返回对象
function get_jsondata(filepath) {
    if (fs.existsSync(filepath)) {
        try {
            return JSON.parse(fs.readFileSync(filepath));
        } catch(e) {
            console.log(`*** 应用程序提示：无法解析“${filepath}”文件为json对象，请检查文件内容格式是否有错。`);
            return {};
        }
    } else {
        console.log(`*** 应用程序提示：“${filepath}”文件不存在，请检查。`);
        return {};
    }
}

//  mottos数据处理：读取并返回所有mottos数组
function get_mottos() {
    return get_jsondata('./src/mottos.json');
}

//  staff数据处理：读取并返回所有staff数组
function get_staff() {
    return get_jsondata('./src/staff.json');
}

//  news数据处理：读取并返回所有新闻列表数组
function get_news_list() {
    return get_jsondata('./src/news/news_list.json');
}

//  news数据处理：从news json文件读取所需的news内容列表并返回
//  参数：
//      news_list: 所有需要显示的新闻列表数组，由'./src/news/news_list.json'读取。
//      start： 新闻列表读取开始位置
//      end： 新闻列表读取结束位置（不包括）
function get_news_jsons(news_list, start, end) {
    let news_jsons = [];
    if(start >= 0 && start < end) {
        let newsitem = null;
        let read_news_list = news_list.slice(start, end);
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

//  service数据处理：读取指定ID（serviceid）的JSON图片/名称数据并按格式返回
function get_service_json(serviceid) {
    let tmpobj = get_jsondata(`./src/services/${serviceid}.json`);
    return {
        id: serviceid,
        name: tmpobj.name,
        image: tmpobj.image,
        preface: tmpobj.preface
    };
}

//  service_list页面数据处理：返回service_list页面所需数据
function get_service_list_data() {
    let sljson = get_jsondata('./src/services/service_list.json');
    for(let cid in sljson) {
        sljson[cid].services_link = []
        for (let pid in sljson[cid].services) {
            sljson[cid].services_link.push(get_service_json(sljson[cid].services[pid]))
        }
    }

    return { servicelist: sljson };
}

//  product数据处理：读取指定ID（productid）的JSON图片/名称数据并按格式返回
function get_product_json(productid) {
    let tmpobj = get_jsondata(`./src/products/${productid}.json`);
    return {
        id: productid,
        name: tmpobj.name,
        image: tmpobj.image
    };
}

//  product_list页面数据处理：返回product_list页面所需数据
function get_product_list_data() {
    let plistjson = get_jsondata('./src/products/product_list.json');
    for(let cid in plistjson) {
        plistjson[cid].products_link = []
        for (let pid in plistjson[cid].products) {
            plistjson[cid].products_link.push(get_product_json(plistjson[cid].products[pid]))
        }
    }

    return { productlist: plistjson };
}

//  about页面数据处理：返回about页面所需数据
function get_about_data() {
    let aboutjson = get_jsondata('./src/about.json');
    aboutjson.mottos = get_mottos();
    aboutjson.staff = get_staff();

    return aboutjson;
}

//  index页面数据处理：返回index页面所需数据
function get_index_data() {
    const MAX_NEWS_ON_INDEX = 6 // index页面显示的新闻数量

    let indexjson = get_jsondata('./src/index.json');
    // 处理products数据
    indexjson.products_json = [];
    for (let id in indexjson.products) {
        indexjson.products_json.push(get_product_json(indexjson.products[id]));
    }
    // 处理services数据
    indexjson.services_json = [];
    for (let id in indexjson.services) {
        indexjson.services_json.push(get_service_json(indexjson.services[id]));
    }
    indexjson.mottos = get_mottos();
    indexjson.newsjsons = get_news_jsons(get_news_list(), 0, MAX_NEWS_ON_INDEX);

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

// PUG模板文件生成HTML（新闻列表）
function newslist2html(cb) {
    const MAX_NEWS_PER_PAGE = 3 // 新闻列表页每页显示的新闻数量
    const news_list = get_news_list();
    const pagecount = Math.trunc((news_list.length - 1) / MAX_NEWS_PER_PAGE) + 1; // 获取新闻导航列表页的总页数。

    for(let id = 1; id <= pagecount; id ++) {
        src('src/news/news_list.pug')
        .pipe(pug({
            locals : { 
                data: {
                    currentpageno: id,
                    pagecount: pagecount,
                    newslist: get_news_jsons(news_list, (id - 1) * MAX_NEWS_PER_PAGE, id * MAX_NEWS_PER_PAGE)
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
    const news_docs_generate_list = get_jsondata('./src/news/news_docs_generate_list.json');

    for(let id in news_docs_generate_list) {
        src('src/news/news_doc.pug')
        .pipe(pug({
            locals : { data: get_jsondata(`./src/news/${news_docs_generate_list[id]}.json`) }
        }))
        .pipe(rename({ basename: news_docs_generate_list[id] }))
        .pipe(dest('dist/'));
        cb();
    }
}

// PUG模板文件生成HTML（服务列表）
function servicelist2html() {
    return src('src/services/service_list.pug')
    .pipe(pug({
        locals : { data: get_service_list_data() }
    }))
   .pipe(dest('dist/'));
}

// PUG模板文件生成HTML（服务文档）
function services2html(cb) {
    const slist = get_jsondata('./src/services/service_list.json');

    for(let cid in slist) {
        for(let sid in slist[cid].services) {
            let fpath = `./src/services/${slist[cid].services[sid]}.json`;
            if (fs.existsSync(fpath)) {
                src('src/services/service_doc.pug')
                .pipe(pug({
                    locals : { data: get_jsondata(fpath) }
                }))
                .pipe(rename({ basename: `service_${slist[cid].services[sid]}` }))
                .pipe(dest('dist/'));
                cb();
            }
        }
    }
}

// PUG模板文件生成HTML（产品列表）
function productlist2html() {
    return src('src/products/product_list.pug')
    .pipe(pug({
        locals : { data: get_product_list_data() }
    }))
   .pipe(dest('dist/'));
}

// PUG模板文件生成HTML（产品文档）
function products2html(cb) {
    const product_list = get_jsondata('./src/products/product_list.json');

    for(let cid in product_list) {
        for(let pid in product_list[cid].products) {
            let fpath = `./src/products/${product_list[cid].products[pid]}.json`;
            if (fs.existsSync(fpath)) {
                src('src/products/product_doc.pug')
                .pipe(pug({
                    locals : { data: get_jsondata(fpath) }
                }))
                .pipe(rename({ basename: `product_${product_list[cid].products[pid]}` }))
                .pipe(dest('dist/'));
                cb();
            }
        }
    }
}

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

exports.default = series(babel2js, parallel(index2html, about2html));
exports.news = parallel(index2html, news2html, newslist2html);
exports.services = parallel(index2html, services2html, servicelist2html);
exports.products = parallel(index2html, products2html, productlist2html);
exports.all = series(babel2js, parallel(
    index2html, about2html, 
    news2html, newslist2html,
    services2html, servicelist2html,
    products2html, productlist2html
));
