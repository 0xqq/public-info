/**
 * 生产上线配置
 */
const gulp = require('gulp')
const cssmin = require('gulp-cssmin')
const rev = require('gulp-rev')
const uglify = require('gulp-uglify')
const revCollector = require('gulp-rev-collector')
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const runSequence = require('run-sequence')
const zip = require('gulp-zip')
const stripDebug = require('gulp-strip-debug')
const autoprefixer = require('gulp-autoprefixer')
const env = require('./env')
// const less = require('gulp-less')
// const babel = require('gulp-babel')
require('./createConfig').constants() // 引入生成配置js文件功能 --> task: configs
const version = require('./config.json')[env.options.env].version

/* 压缩js */
gulp.task('minJs', _ => {
    return gulp.src([
        'src/**/*.js',
        '!src/assets/**/*',
        '!src/script/test/**/*',
        `!src/${env.path.configJs}`, // 不处理src目录下的base.js文件
        `dist/${env.path.configJs}`  // 处理dist目录下的base.js文件
    ])
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'))
})

/* 压缩css */
gulp.task('minCss', _ => {
    return gulp.src([
        'src/**/*.css',
        '!src/style/test/**/*',
        '!src/assets/**/*'
    ])
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(rev())
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'))
})

/* 压缩html */
gulp.task('minHtml', _ => {
    return gulp.src([
        'src/**/*.html',
        '!src/views/test/**/*',
    ])
        .pipe(htmlmin({
            removeComments: true, // 清除HTML注释
            collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> ==> <input checked />
            removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true, // 删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
            collapseWhitespace: true, // 压缩HTML
            minifyJS: true, // 压缩页面JS
            minifyCSS: true // 压缩页面CSS
        }))
        .pipe(gulp.dest('dist'))
})

/* 替换html文件引入文件，加上md5后缀 */
gulp.task('rev', ['minJs', 'minCss', 'minHtml'], _ => {
    return gulp.src(['rev/**/*.json', 'dist/**/*.html'])
        .pipe(revCollector({replaceReved: true})) // 执行文件内引用名的替换
        .pipe(gulp.dest('dist')) // 替换后的文件输出的目录
})

/* 拷贝文件 START */
gulp.task('copyAssets', _ => {
    return gulp.src([
        'src/assets/**/*',
        '!src/assets/imgs/source/**/*'
    ])
        .pipe(gulp.dest('dist/assets'))
})
/* 拷贝文件 END */

/* 删除内容 */
gulp.task('clean:dist', cb => {
    return del([
        'dist/**/*'
    ], cb)
})
gulp.task('clean:base', cb => {
    return del([
        `dist/${env.path.configJs}`
    ], cb)
})

/* 打包成zip文件 */
gulp.task('zip', _ => {
    return gulp.src('dist/**/*.*')
        .pipe(zip(`dist_${version}.zip`))
        .pipe(gulp.dest('./build'))
})

/* 打包上线---gulp build */
function pro() {
    gulp.task('build', cb => {
        runSequence(
            'clean:dist',
            'configs',
            ['minJs', 'minCss', 'minHtml', 'rev', 'copyAssets'],
            'clean:base',
            'zip',
            cb
        )
    })
}

module.exports = pro