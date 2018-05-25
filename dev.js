/**
 * 开发阶段配置
 */
const gulp = require('gulp')
const less = require('gulp-less')
const babel = require('gulp-babel')
const autoprefixer = require('gulp-autoprefixer')
const runSequence = require('run-sequence')
const connect = require('gulp-connect')
const proxy = require('http-proxy-middleware')

require('./createConfig').constants() // 引入生成配置js文件功能 --> task: configs

/* 编译less */
gulp.task('dev:less', _ => {
    return gulp.src('src/**/*.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('src'))
        .pipe(connect.reload())
})

/* 编译es6 */
gulp.task('dev:es6', _ => {
    return gulp.src('src/**/*.es6')
        .pipe(babel({presets: ['es2015']}))
        .pipe(gulp.dest('src'))
        .pipe(connect.reload())
})

/* html自动更新 */
gulp.task('dev:html', _ => {
    return gulp.src('src/**/*.html')
        .pipe(connect.reload())
})
/* 监控代码变更 */
gulp.task('watch', _ => {
    gulp.watch('src/**/*.less', ['dev:less'])
    gulp.watch('src/**/*.es6', ['dev:es6'])
    gulp.watch('src/**/*.html', ['dev:html'])
    // gulp.watch('config.json', ['configs']) // 修改config.json后需要重启开发环境才能生效
})

gulp.task('server', _ => {
    connect.server({
        livereload: true,
        root: 'src',
        port: 8888,
        host: '::',
        middleware(connect, opt) { // 配置代理
            return [
                proxy('/api', {
                    target: 'http://172.28.0.56:9000/supp/httpClient',
                    changeOrigin: true,
                    pathRewrite: {'^/api': ''}
                })
            ]
        }
    })
})

function dev() {
    gulp.task('dev', cb => {
        runSequence(
            'configs',
            ['dev:less', 'dev:es6'],
            ['watch', 'server'],
            cb
        )
    })
}

module.exports = dev