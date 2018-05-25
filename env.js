/**
 * 环境变量
 * 控制生成的配置js
 */
const minimist = require('minimist')

const knownOptions = {
    string: 'env',
    default: {
        env: process.env.NODE_ENV || 'development'
    }
}
const options = minimist(process.argv.slice(2), knownOptions)
const path = {
    configJson: './config.json', // json配置文件路径
    configJs: 'base.js', // 生成的js配置文件名字
    configVar: 'var BASE', // 生成的js配置文件里的全局变量
    configDest: options.env === 'development' ? 'src/' : 'dist/' // 生成的js配置文件存放路径
}

module.exports = {
    path,
    options
}