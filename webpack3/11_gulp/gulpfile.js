const gulp = require('gulp');
const webpack = require('webpack-stream');
const configs = require('./webpack.config');
gulp.task('default', function() {
    return gulp.src('./src/index.js')//这个entry不知何用
    .pipe(webpack(configs))
    .pipe(gulp.dest('dist/'));
});