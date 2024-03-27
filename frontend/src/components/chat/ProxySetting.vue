<template>
    <div class="tab-box">
        <div class="tab-box-title">代理设置</div>
        <el-form label-position="left" label-width="90px">

            <el-form-item label="启用代理服务器" label-width="150px">
                <el-switch v-model="data.cookieOpen" @change="change"/>
            </el-form-item>

            <el-form-item label="协议">
                <el-select v-model="data.type" placeholder="请选择协议" class="form-item" @change="change">
                    <el-option :label="item.label" :value="item.value" v-for="item in proxyTypes" :key="item.label" />
                </el-select>
            </el-form-item>
            <el-form-item label="地址">
                <el-input v-model="data.host"   class="form-item"/>
            </el-form-item>
            <el-form-item label="端口">
                <el-input v-model="data.port"   class="form-item"/>
            </el-form-item>

            <el-divider />

            <el-form-item label="启动代理服务器验证" label-width="150px">
                <el-switch :disabled="data.type && data.type.indexOf('SOCKS') > -1" v-model="data.auth" @change="change"/>
            </el-form-item>

            <el-form-item label="用户名">
                <el-input :disabled="!data.auth" v-model="data.user"   class="form-item" @change="change" />
            </el-form-item>
            <el-form-item label="密码">
                <el-input :disabled="!data.auth" v-model="data.password"   class="form-item" @change="change"/>
            </el-form-item>

            <el-divider />
            <el-form-item label-width="50px">
                    <el-button type="primary" @click="changeProxyInfo">保存代理</el-button>
                    <el-button type="success" @click="check">检测代理</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
const { clipboard } = require('electron')
import translate from '@/constant/proxydefaul'
import { ElMessage } from 'element-plus'
import { checkIp } from '@/utils/proxyCheck'
export default {
    props: ["data", "id"],
    emits: ["change",],
    data() {
        return {
            channels: translate.channels,
            proxyTypes:[
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
        };
    },
    methods: {
        change(item) {
            // this.$emit("change", this.data)
            if(this.data.type.indexOf('SOCKS') > -1){
                this.auth = false
            }
        },
        changeProxyInfo(){
            this.$emit("change", this.data)
            ElMessage({
                showClose: true,
                message: '代理设置成功',
                type: 'success',
            })
        },
        check(){
            checkIp(this.data.host, this.data.port, (res, t)=>{
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
    padding: 15px 10px;
    width: 100%;
}

.tab-box-title {
    font-size: 15px;
    font-weight: 900;
}

.reply-box {
    padding-top: 10px;
}

.box-item {
    width: 100%;
}

.form-item{
    width: 180px;
}
</style>
