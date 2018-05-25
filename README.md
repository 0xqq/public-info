# gulpItem
## 1.cmd
```cmd
+ npm run dev    --> 开发环境
+ npm run test   --> 测试环境
+ npm run build  --> 生产环境
```
## 2.project structure
```
│  config.json                   // 配置文件
│  createConfig.js               // 根据config.json生成base.js文件
│  dev.js                        // 开发环境
│  env.js                        // 环境设置
│  gulpfile.js                   // gulp 入口
│  package.json                  // 依赖包记录文件
│  pro.js                        // 生产环境
│            
├─node_modules                   // 依赖包
│            
├─build                          // 打包生成zip目录
│           
├─dist                           // 打包后文件
│           
├─rev                            // md5后缀记录
│          
└─src
    │  base.js                    // 根据config.json生成的`请勿手动修改，手动改后无效`
    │  
    ├─assets                      // 静态资源，直接拷贝
    │                      
    ├─common                      // 公共部分
    │       
    ├─script                      // js代码
    │          
    ├─style                       // css代码
    │          
    └─views                       // html代码
```
                

