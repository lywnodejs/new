/**
 * Created by zhaobo on 19/07/12.
 */

var gulp = require('gulp');
var rev = require('gulp-rev');
var minifycss = require('gulp-minify-css');
var revCollector = require('gulp-rev-collector');
var uglify = require('gulp-uglify');
var del = require('del');
var removeConsole = require('gulp-config-strip-debug');
// var concat = require('gulp-concat'); //合并文件
// var smushit = require('gulp-smushit'); //压缩图片

//压缩js，加版本号，生成映射文件
// gulp.task('uglifyjs', function () {
//     return gulp.src(['src/static/js/**/*.js'])
//         .pipe(removeConsole())
//         .pipe(rev())
//         .pipe(uglify())
//         .pipe(gulp.dest('dist/static/js/'))
//         .pipe(rev.manifest())
//         .pipe(gulp.dest('./rev/js'))
// });
//
// //search and replace custom JS/CSS file links in HTML files under src root
// gulp.task('rev', function() {
//     return gulp.src(['./rev/**/*.json', './dist/interfaceConfig.js'])
//         .pipe(revCollector({replaceReved: true}))
//         .pipe(gulp.dest('./dist'))
// });



function uglifyjs() {
    return gulp.src(['src/static/js/**/*.js'])
        .pipe(removeConsole())
        .pipe(rev())
        .pipe(uglify())
        .pipe(gulp.dest('dist/static/js/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/js'))
}

function delDir () {
    return del(['rev']);
}


// gulp.task('default', gulp.series(uglifyjs, delDir))

var build = gulp.series(uglifyjs, delDir);

// exports.clean = clean;
// exports.styles = styles;
// exports.scripts = scripts;
// exports.uglifyjs = uglifyjs;
// exports.delDir = delDir;
// exports.build = build;

exports.default = build;
