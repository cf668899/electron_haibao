<template>
    <div class="tab-box">
        <div class="tab-box-title">代理设置</div>
        <el-form label-position="left" label-width="90px">
            
            <el-form-item label="启用代理服务器" label-width="150px">
                <el-switch v-model="data.message.openproxy" @change="change"/>
            </el-form-item>

            <el-form-item label="协议">
                <el-select v-model="data.message.proxy" placeholder="请选择协议" class="form-item" @change="change">
                    <el-option :label="item.label" :value="item.value" v-for="item in channels" :key="item.label" />
                </el-select>
            </el-form-item>
            <el-form-item label="地址">
                <el-input v-model="data.message.address"   class="form-item"/>
            </el-form-item>
            <el-form-item label="端口">
                <el-input v-model="data.message.port"   class="form-item"/>
            </el-form-item>

           

            <el-divider />

            <el-form-item label="启动代理服务器验证" label-width="150px">
                <el-switch v-model="data.message.openpwd" @change="change"/>
            </el-form-item>

            <el-form-item label="用户名">
                <el-input v-model="data.message.username"   class="form-item"/>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="data.message.pwd"   class="form-item"/>
            </el-form-item>

            <el-divider />
            <el-form-item>
                <el-button type="primary" @click="changeProxyInfo">保存代理</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
  
<script>
const { clipboard } = require('electron')
import translate from '@/constant/proxydefaul'
export default {
    props: ["data"],
    emits: ["change",],
    data() {
        return {
            channels: translate.channels
        };
    },
    methods: {
        change(item) {
            this.$emit("change", this.data)
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
  