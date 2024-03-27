<template>
    <div class="tab-box">
      <el-form label-position="left" label-width="180px" style="width: 100%" >
        <el-form-item label="实时翻译" label-width="80px">
          <el-switch v-model="translateInfo.autoTranslate" @change="changeTranslateSetting"/>
        </el-form-item>
        <el-form-item label="翻译线路">
          <el-select v-model="translateInfo.channel" placeholder="请选择语言" class="form-item" @change="changeTranslateSetting">
            <el-option :label="item.label" :value="item.value" v-for="item in channels" :key="item.value" />
          </el-select>
        </el-form-item>

        <div v-for="item in translateInfo.apps" @mousemove="selectType(item.type)">
          <el-form-item>
            <template #label>
              <span style="color:#409EFF">{{ item.title }}</span>
            </template>
          </el-form-item>
          <el-form-item label="源语言">
              <el-select v-model="item.source" placeholder="请选择语言" class="form-item" @change="changeTranslateSetting">
                <el-option :label="language.name" :value="language.loca" v-for="language in languages" :key="language.loca" />
              </el-select>
            </el-form-item>

            <el-form-item label="目标语言">
              <el-select v-model="item.target" placeholder="请选择语言" class="form-item" @change="changeTranslateSetting">
                <el-option :label="language.name" :value="language.loca" v-for="language in languages" :key="language.loca" />
              </el-select>
            </el-form-item>

            <el-form-item label="接收语言">
              <el-select v-model="item.receive" placeholder="请选择语言" class="form-item" @change="changeTranslateSetting">
                <el-option :label="language.name" :value="language.loca" v-for="language in languages" :key="language.loca" />
              </el-select>
            </el-form-item>
          </div>
  
      </el-form>
    </div>
  </template>
  
  <script>
  import translate from '@/constant/translate'
  const { ipcRenderer: ipc } = (window.require && window.require('electron')) || window.electron || {}
  import { ElMessage } from 'element-plus'
  export default {
    props: ["data"],
    emits: ["changeTranslateSetting"],
    data() {
      return {
        languages: translate.languages,
        channels: translate.channels,
        translateInfo:{
          changeType: null,
          autoTranslate: true,
          channel: 'deepl',
          apps:[
            {
              type: 'Whatsapp',
              title: 'Whatsapp的翻译设置',
              source: '0',
              target: 'en-US',
              receive: 'zh'
            },
            {
              type: 'Telegram',
              title: 'Telegram的翻译设置',
              source: '0',
              target: 'en-US',
              receive: 'zh'
            }
          ],
        },
      }
    },
    created(){
      ipc.invoke("controller.config.getTranslate").then((res) => {
        if(res){
          this.translateInfo = res
        }
      });
    },
    methods: {
      selectType(type){
        this.translateInfo.changeType = type
      },
      changeTranslateSetting() {
        this.$emit("changeTranslateSetting",JSON.parse(JSON.stringify(this.translateInfo)))
        this.translateInfo.changeType = null
        ElMessage.warning('设置完成重新打开会话生效')
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


  .form-item{
    width: 200px;
  }


  </style>
  