# 目录结构
project
├── package.json npm包配置
├── bulid 打包用的资源和脚本
    ├── icons 软件图标（打包用到）
    ├── extraResources 额外资源目录
├── electron 主进程服务
    ├── addon 插件目录
        ├── example demo插件（代码示例）
    ├── config 配置文件
        ├── bin.js 开发环境配置
        ├── config.default.js 默认配置，都会加载
        ├── config.local.js dev环境加载
        ├── config.prod.js 生产环境加载
        ├── encrypt.js 加密配置文件
        ├── builder.json 打包配置
    ├── controller 控制器
    ├── service 业务层
    ├── preload 预加载，在程序启动时加载，如托盘、自动升级等功能要提前加载代码
    ├── jobs 任务
├── frontend 前端目录（demo是用vue编写的）  
├── go go目录(可选)
├── out 打包后生成的可执行文件
├── latest.yml 自动升级文件
    ├── xxx.exe window应用安装包
    ├── xxx.exe.blockmap window应用增量升级包
    ├── xxx.dmg mac应用安装包
    ├── xxx.deb linux应用安装包后缀有多种    
├── logs 日志
├── main.js 入口文件
├── public 资源目录
    ├── dist 前端资源会移动到这里，生产环境加载
    ├── electron 业务js加密后的文件
    ├── html 一些模板
    ├── images 一些图片
├── data 内置数据库文件
    ├── system.json 框架使用的数据库
    ├── demo.json 示例json数据库
    ├── sqlite-demo.db 示例sqlite数据库

##########################################################################################

# 预发布模式（环境变量为：prod），请先移动资源
npm run start

# 移动前端静态资源
npm run rd

# 移动资源，可配置
npm run move

# 代码加密
npm run encrypt

# 清除加密的代码
npm run clean

# 生成logo
npm run icon

# 打包 （windows版）
npm run build-w (调整为64位)
npm run build-w-32 (32位)
npm run build-w-64 (64位)
npm run build-w-arm64 (arm64)

# 打包 （windows 免安装版）
# ee > v2.2.1
npm run build-wz (调整为64位)
npm run build-wz-32 (32位)
npm run build-wz-64 (64位)
npm run build-wz-arm64 (arm64)

# 打包 （mac版）
npm run build-m
npm run build-m-arm64 (m1芯片架构)

# 打包 （linux版）
# ee > v2.2.1
npm run build-l (默认64位 deb包)
npm run build-l-32 (32位 deb包)
npm run build-l-64 (64位 deb包)
npm run build-l-arm64 (64位 deb包 arm64)
npm run build-l-armv7l (64位 deb包 armv7l)
npm run build-lr-64 (64位 rpm包)
npm run build-lp-64 (64位 pacman包)
##########################################################################################

其他详情信息查看: https://www.kaka996.com/pages/ad838d/