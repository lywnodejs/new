/**
 * Created by zhaobo on 19/07/12.
 */

var gulp = require('gulp');
var rev = require('gulp-rev');
let cleanCSS = require('gulp-clean-css');
var revCollector = require('gulp-rev-collector');
// var uglify = require('gulp-uglify');
var uglify = require('gulp-uglify-es').default;
// var htmlMin = require('gulp-htmlmin');
var del = require('del');
var removeConsole = require('gulp-config-strip-debug');
// var concat = require('gulp-concat'); //合并文件
// var imagemin = require('gulp-imagemin');

// 拷贝ejs文件
gulp.task('copyEjs', () => {
  return gulp.src(['src/questionView/**'])
    .pipe(gulp.dest('dist/questionView'))
})

// 拷贝弹窗 html文件
gulp.task('copyPopupHtml', () => {
  return gulp.src(['src/static/popups/**'])
    .pipe(gulp.dest('dist/static/popups'))
})

// 拷贝图片-客户端用
// gulp.task('copyImages1', () => {
//   return gulp.src(['src/static/client/images/**'])
//     // .pipe(imagemin())
//     .pipe(gulp.dest('dist/static/client/images/'))
// })

// 拷贝图片-服务端用
gulp.task('copyImages2', () => {
  return gulp.src(['src/static/images/**'])
    // .pipe(imagemin())
    .pipe(gulp.dest('dist/static/images/'))
})

// 拷贝字体-客户端用
// gulp.task('copyFont1', () => {
//   return gulp.src(['src/static/client/css/fonts/**'])
//     .pipe(gulp.dest('dist/static/client/css/fonts'))
// })

// 拷贝字体-服务端用
gulp.task('copyFont2', () => {
  return gulp.src(['src/static/css/fonts/**'])
    .pipe(gulp.dest('dist/static/css/fonts'))
})

// gulp.task('copyHtml', () => {
//   return gulp.src(['src/static/html/**'])
//     .pipe(gulp.dest('dist/static/html'))
// })

// 拷贝js库文件-客户端
gulp.task('copyLibs1', () => {
  return gulp.src(['src/static/client/js/libs/**'])
    .pipe(gulp.dest('dist/static/client/js/libs/'))
})

// 拷贝js库文件-服务端
gulp.task('copyLibs2', () => {
  return gulp.src(['src/static/js/libs/**'])
    .pipe(gulp.dest('dist/static/js/libs/'))
})

// 拷贝CSS文件-服务端
// gulp.task('copyCSS', () => {
//   return gulp.src(['src/static/css/**'])
//     .pipe(gulp.dest('dist/static/css/'))
// })

// 压缩CSS-客户端
gulp.task('minifyCSS', () => {
  return gulp.src('src/static/css/*.css')
    .pipe(rev())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/static/css'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./rev/css'))
});

// 压缩CSS，不加版本号-客户端
// 供知行财讯类似项目引用
gulp.task('minifyCSSNoVersion', () => {
  return gulp.src('src/static/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/static/css'))
});

// 压缩js文件，添加版本号
gulp.task('uglifyJs', () => {
  return gulp.src(['src/static/client/**/*.js', '!src/static/client/js/libs/**/*.js'])
    .pipe(removeConsole())
    .pipe(rev())
    .pipe(uglify())
    .pipe(gulp.dest('dist/static/client'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./rev/js'))
})

// 压缩js文件
gulp.task('uglifyJs2', () => {
  return gulp.src(['src/static/js/**/*.js', '!src/static/js/libs/**/*.js'])
    .pipe(removeConsole())
    .pipe(uglify())
    .pipe(gulp.dest('dist/static/js'))
})

// 替换ejs文件中的版本号
gulp.task('revc', () => {
  return gulp.src(['./rev/**/*.json',
    'dist/questionView/index.ejs',
    'dist/questionView/page*.ejs'])
    .pipe(revCollector({replaceReved: true}))
    .pipe(gulp.dest('./dist/questionView'));
})

// 压缩Highchart
function uglifyHighchart() {
  return gulp.src(['src/static/js/libs/7.0/highstock.src.js'])
    .pipe(uglify())
    .pipe(gulp.dest('dist/static/js/libs/7.0/'))
}

function delRevDir () {
    return del(['rev']);
}

function delDist () {
    return del(['dist'])
}

var build = gulp.series(
  delDist,  // 因jenkins构建报错，暂时注释
  gulp.parallel('copyEjs',
                'copyPopupHtml',
                'copyImages2',
                'copyFont2',
                'copyLibs1',
                'copyLibs2'),
  'minifyCSS',
  'minifyCSSNoVersion',
  'uglifyJs',
  'uglifyJs2',
  uglifyHighchart,
  'revc',
  delRevDir
);

// exports.clean = clean;
// exports.styles = styles;
// exports.scripts = scripts;
// exports.uglifyjs = uglifyjs;
// exports.delDist = delDist;
// exports.delRevDir = delRevDir;
// exports.build = build;
// exports.uglifyHighchart = uglifyHighchart;

exports.default = build;
