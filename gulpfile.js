require('./dev')() // 开发环境任务 --> task: gulp dev --env development；task: gulp server
require('./pro')() // 打包上线任务 --> task: gulp build --env production