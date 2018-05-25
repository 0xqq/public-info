/**
 * 生成配置js文件
 */
const gulp = require('gulp')
const gutil = require('gulp-util')
const del = require('del')
const runSequence = require('run-sequence')
const env = require('./env')

//生成filename文件，存入string内容
function string_src(filename, string) {
    let src = require('stream').Readable({ objectMode: true })
    src._read = function () {
        this.push(new gutil.File({
            cwd: "",
            base: "",
            path: filename,
            contents: new Buffer(string)
        }))
        this.push(null)
    }
    return src
}

gulp.task('clean:configs', cb => {
    return del([
        env.path.configDest + env.path.configJs
    ], cb)
})
gulp.task('constants', _ => {
    //读入config.json文件
    let myConfig = require(env.path.configJson)
    //取出对应的配置信息
    let envConfig = myConfig[env.options.env]
    let conConfig = env.path.configVar + '=' + JSON.stringify(envConfig);
    //生成配置js文件
    return string_src(env.path.configJs, conConfig)
        .pipe(gulp.dest(env.path.configDest))
})

function constants() {
    gulp.task('configs', cb => {
        runSequence('clean:configs', 'constants', cb)
    })
}

module.exports = { constants }