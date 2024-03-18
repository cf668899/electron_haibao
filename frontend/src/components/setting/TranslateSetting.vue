<template>
    <div class="tab-box">
      <el-form label-position="left" label-width="180px">
        <el-form-item label="实时翻译" label-width="80px">
          <el-switch v-model="data.autoTranslate" @change="changeTranslateSetting"/>
        </el-form-item>
        <el-form-item label="翻译线路">
          <el-select v-model="data.channel" placeholder="请选择语言" class="form-item" @change="changeTranslateSetting">
            <el-option :label="item.label" :value="item.value" v-for="item in channels" :key="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="源语言">
          <el-select v-model="data.source" placeholder="请选择语言" class="form-item" @change="changeTranslateSetting">
            <el-option :label="item.name" :value="item.loca" v-for="item in languages" :key="item.loca" />
          </el-select>
        </el-form-item>

        <el-form-item label="目标语言">
          <el-select v-model="data.target" placeholder="请选择语言" class="form-item" @change="changeTranslateSetting">
            <el-option :label="item.name" :value="item.loca" v-for="item in languages" :key="item.loca" />
          </el-select>
        </el-form-item>

        <el-form-item label="接收语言">
          <el-select v-model="data.receive" placeholder="请选择语言" class="form-item" @change="changeTranslateSetting">
            <el-option :label="item.name" :value="item.loca" v-for="item in languages" :key="item.loca" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  import translate from '@/constant/translate'
  export default {
    props: ["data"],
    emits: ["changeTranslateSetting"],

    data() {
      return {
        languages: translate.languages,
        channels: translate.channels,
      };
    },
    methods: {
      changeTranslateSetting() {
        this.$emit("changeTranslateSetting", this.data)
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
  