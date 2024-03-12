<template>
    <div class="tab-box">
        <div class="tab-box-title">翻译设置</div>
        <el-form label-position="left" label-width="90px">
            <el-form-item label="翻译线路">
                <template #label>
                    <span>
                        翻译线路
                        <el-tooltip effect="dark" content="设置完成重新打开会话生效" placement="top-start">
                            <el-icon>
                                <QuestionFilled />
                            </el-icon>
                        </el-tooltip>
                    </span>
                </template>
                <el-select v-model="data.channel" placeholder="请选择线路" class="form-item" @change="change">
                    <el-option :label="item.label" :value="item.value" v-for="item in channels" :key="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="接收消息实时翻译" label-width="150px">
                <el-switch v-model="data.message.open" @change="change"/>
            </el-form-item>

            <el-form-item label="源语言">
                <el-select v-model="data.message.source" placeholder="请选择语言" class="form-item" @change="change">
                    <el-option :label="item.name" :value="item.loca" v-for="item in languages" :key="item.loca" />
                </el-select>
            </el-form-item>

            <el-form-item label="目标语言">
                <el-select v-model="data.message.target" placeholder="请选择语言" class="form-item" @change="change">
                    <el-option :label="item.name" :value="item.loca" v-for="item in languages" :key="item.loca" />
                </el-select>
            </el-form-item>

            <el-divider />

            <el-form-item label="发送消息实时翻译" label-width="150px">
                <el-switch v-model="data.inputContent.open" @change="change"/>
            </el-form-item>

            <el-form-item label="源语言">
                <el-select v-model="data.inputContent.source" placeholder="请选择语言" class="form-item" @change="change">
                    <el-option :label="item.name" :value="item.loca" v-for="item in languages" :key="item.loca" />
                </el-select>
            </el-form-item>

            <el-form-item label="目标语言">
                <el-select v-model="data.inputContent.target" placeholder="请选择语言" class="form-item" @change="change">
                    <el-option :label="item.name" :value="item.loca" v-for="item in languages" :key="item.loca" />
                </el-select>
            </el-form-item>

            <el-divider />
            <div>
                <el-text class="mx-1" >提示：</el-text>
            </div>
            <ul class="lineH-right">
                <li><el-text class="mx-1" >按下Enter自动翻译并发送</el-text></li>
                <li><el-text class="mx-1" >输入框上方可以快捷关闭发生翻译</el-text></li>
            </ul>
        </el-form>
    </div>
</template>
  
<script>
const { clipboard } = require('electron')
import translate from '@/constant/translate'
export default {
    props: ["data"],
    emits: ["change",],
    data() {
        return {
            languages: translate.languages,
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
  