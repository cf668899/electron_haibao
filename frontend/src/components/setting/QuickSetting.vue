<template>
  <div class="tab-box">
    <el-form label-position="left" label-width="180px" style="width: 100%">
      <el-form-item>
        <template #label>
          <span class="commonTitle">代理服务器（全局）</span>
        </template>
      </el-form-item>
      <el-form-item label="显示/隐藏主窗口">
        <el-col :span="5">
          <el-input
            v-on:keyup="change"
            v-model="hideOrView"
            placeholder="按下你的键盘"
          />
        </el-col>
      </el-form-item>
      <el-form-item>
        <template #label>
          <div class="tipBox">
            <span>窗口拆分快捷键</span>
            <el-tooltip effect="dark" content="窗口拆分快捷键" placement="top">
              <el-icon><Warning /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-col :span="5">
          <el-input
            v-on:keyup="changeSplit"
            v-model="splitBox"
            placeholder="按下你的键盘"
          />
        </el-col>
      </el-form-item>

      <el-form-item style="padding-top: 30px">
        <template #label>
          <span class="commonTitle">软件设置</span>
        </template>
      </el-form-item>

      <el-form-item label="软件版本">
        <el-button>检查更新</el-button>
      </el-form-item>

      <el-form-item label="消息未读角标">
        <el-select placeholder="请选择" class="form-item" @change="change">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in viewType"
            :key="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="会话文本显示">
        <template #label>
          <div class="tipBox">
            <span>会话文本显示</span>
            <el-tooltip effect="dark" content="会话文本显示" placement="top">
              <el-icon><Warning /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-select placeholder="请选择" class="form-item" @change="change">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in viewType"
            :key="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="关闭程序">
        <el-select placeholder="请选择" class="form-item" @change="change">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in viewType"
            :key="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="语言">
        <el-select placeholder="请选择" class="form-item" @change="change">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in viewType"
            :key="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
const { ipcRenderer: ipc } =
  (window.require && window.require('electron')) || window.electron || {}
export default {
  props: ['data'],
  emits: ['changeTranslateSetting'],
  data() {
    return {
      proxy: {
        global: {
          open: false,
          type: 'http',
          host: '',
          port: '',
          auth: false,
          user: '',
          password: '',
        },
        cookieOpen: false,
      },
      hideOrView: '',
      splitBox: '',
      viewType: [
        {
          label: '显示',
          value: '1',
        },
        {
          label: '显示2',
          value: '2',
        },
      ],
    }
  },
  created() {},
  methods: {
    change(event) {
      // 获取按键的keyCode
      this.hideOrView = event.code
    },
    changeSplit(event) {
      this.splitBox = event.code
    },
  },
}
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
}
.tipBox {
  display: flex;
  align-items: center;
}
.tipBox span {
  margin-right: 6px;
}
</style>
