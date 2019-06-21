const { src, dest, series, parallel } = require('gulp');
const babel = require('gulp-babel');
const pug = require('gulp-pug');

function babelTask() {
    return src('src/*.js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(dest('dist/'));
}
  
function pugTask() {
    return src('src/index.pug')
    .pipe(pug())
    .pipe(dest('dist/'));
}

exports.default = parallel(babelTask, pugTask);
