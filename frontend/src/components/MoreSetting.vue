<template>
  <div class="setting-box">
    <el-tabs type="border-card" class="demo-tabs">
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Connection /></el-icon>
            <span>翻译设置</span>
          </span>
        </template>
        <TranslateSetting
          :data="translateInfo"
          @changeTranslateSetting="translateSettingChange"
        ></TranslateSetting>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Aim /></el-icon>
            <span>代理网络</span>
          </span>
        </template>
        <ProxySetting></ProxySetting>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Setting /></el-icon>
            <span>快捷设置</span>
          </span>
        </template>
        <QuickSetting />
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Grid /></el-icon>
            <span>支持平台</span>
          </span>
        </template>
        支持平台
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Lock /></el-icon>
            <span>网络监测</span>
          </span>
        </template>
        <CheckNet />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TranslateSetting from './setting/TranslateSetting.vue'
import ProxySetting from './setting/ProxySetting.vue'
import QuickSetting from './setting/QuickSetting.vue'
import CheckNet from './setting/CheckNet.vue'
const { ipcRenderer: ipc } =
  (window.require && window.require('electron')) || window.electron || {}
export default {
  name: 'moreSetting',
  components: { TranslateSetting, ProxySetting, QuickSetting, CheckNet },
  data() {
    return {
      test: '',
      translateInfo: {
        autoTranslate: true,
        channel: 'deepl',
        source: '0',
        target: 'en-US',
        receive: 'zh',
      },
    }
  },
  methods: {
    translateSettingChange(data) {
      //todo 设置完翻译的配置之后，要进行保存，到聊天界面上面去取对应的设置配置信息。
      ipc.invoke('controller.config.setTranslate', data)
    },
  },
}
</script>
<style scoped>
.el-header {
  padding: 0;
  height: 30px;
}
.el-main {
  padding: 0;
}
.el-card {
  height: 100%;
  border: 0px;
}
.setting-box {
  margin: 0 10px;
  height: 100%;
}

.el-tabs {
  height: 98%;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.demo-tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}
.demo-tabs .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}
</style>
