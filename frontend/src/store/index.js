import { createStore } from 'vuex'
// 这次我将需要导入的文件放到store/modules文件夹下面了
//  import.meta.globEager的参数必须是绝对路径或者相对路径，不能是路径别名。也就是以点和斜杠开头的字符串。
let modules = {}
const modulesFiles = import.meta.globEager('./modules/*.js')
// console.log(modulesFiles,"过滤出多少个")
for (const path in modulesFiles) {
    const moduleName = path.replace(/(.*\/)*([^.]+).*/gi, '$2')
    // console.log(moduleName,"模块名字")
    // modules = { ...modules, ...modulesFiles[path] }
    modules = {...modules,[moduleName]:modulesFiles[path].default}
}
// console.log(modules,"结果")
const store = createStore({
    state: {
    },
    mutations: {
    },
    actions: {
    },
    modules: modules,
})
console.log(modules,"vuex")
export default store