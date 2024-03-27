<template>
    <div class="tab-box">
        <el-form label-position="left" label-width="180px" style="width:100%">
            <el-form-item>
                <template #label>
                    <span style="color:#409EFF">代理服务器（全局）</span>
                </template>
            </el-form-item>
            <el-checkbox v-model="proxy.open" @change="change">启用代理服务器</el-checkbox>
            <el-form-item label="代理类型">
                <el-select style="width:60%" v-model="proxy.type" placeholder="请选择类型" class="form-item"
                    @change="change">
                    <el-option :label="item.label" :value="item.value" v-for="item in proxyTypes" :key="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item label="服务器">
                <el-row class="item">
                    <el-col :span="15">
                        <el-input :disabled="!proxy.open" @change="change" v-model="proxy.host"
                            placeholder="请输入主机地址" />
                    </el-col>
                    <el-col :span="1">
                        ：
                    </el-col>
                    <el-col :span="8">
                        <el-input :disabled="!proxy.open" @change="change" v-model="proxy.port"
                            placeholder="请输入端口号" />
                    </el-col>
                </el-row>
            </el-form-item>

            <el-checkbox :disabled="proxy.type.indexOf('SOCKS') > -1" v-model="proxy.auth" @change="change">启用代理服务器验证</el-checkbox>
            <el-form-item label="用户名">
                <el-input :disabled="!proxy.auth" class="item" v-model="proxy.user" placeholder="请输入用户名"
                    @change="change" />
            </el-form-item>

            <el-form-item label="密码">
                <el-input :disabled="!proxy.auth" class="item" v-model="proxy.password" placeholder="请输入用密码"
                    @change="change" />
            </el-form-item>

            <div>
                <el-button plain type="primary" @click="check">检查代理服务器</el-button>
                <el-button type="primary" @click="setting" >应用</el-button>
            </div>

            <el-divider />
            <el-checkbox v-model="proxy.cookieOpen" @change="change">启用会话代理功能</el-checkbox>
        </el-form>
    </div>
</template>
  
<script>
import translate from '@/constant/translate'
const { ipcRenderer: ipc } = (window.require && window.require('electron')) || window.electron || {}
import { ElMessage } from 'element-plus'
import { checkIp } from '@/utils/proxyCheck'
export default {
    props: ["data"],
    emits: ["changeTranslateSetting"],
    data() {
        return {
            proxy: {
                open: false,
                type: 'HTTP',
                host: '',
                port: '',
                auth: false,
                user: '',
                password: '',
                cookieOpen: false
            },
            proxyTypes: [
                {
                    label: 'HTTP',
                    value: 'HTTP'
                },
                {
                    label: 'HTTPS',
                    value: 'HTTPS'
                },
                {
                    label: 'SOCKS4',
                    value: 'SOCKS4'
                },
                {
                    label: 'SOCKS5',
                    value: 'SOCKS5'
                },
            ]
        }
    },
    created() {
        ipc.invoke("controller.config.getProxy").then((res) => {
            if (res) {
                this.proxy = res
            }
        });
    },
    methods: {
        change() {
            if(this.proxy.type.indexOf('SOCKS') > -1){
                this.proxy.auth = false
            }
            // let config = JSON.parse(JSON.stringify(this.proxy))
            // ipc.invoke("controller.config.setProxy", config)
        },
        setting(){
            let config = JSON.parse(JSON.stringify(this.proxy))
            ipc.invoke("controller.config.setProxy", config)
            ipc.invoke("controller.app.settingGlobalProxy", config)
            ElMessage({
                showClose: true,
                message: '代理设置成功',
                type: 'success',
            })
        },
        check(){
            checkIp(this.proxy.host, this.proxy.port, (res, t)=>{
                console.log(res, t)
                if(res){
                    ElMessage.success('代理服务器可用')
                }else{
                    ElMessage.warning('代理服务器不可用')
                }
            })
        }
    },
};
</script>
<style scoped>
.tab-box {
    text-align: left;
    padding: 15px 15px;
    width: 100%;
    height: 100%;
}


.form-item {
    width: 200px;
}

.item {
    width: 60%;
}</style>
  