<template>
  <div class="tab-box">
    <el-form label-position="left" label-width="180px" style="width: 100%">
      <el-form-item>
        <template #label>
          <span class="commonTitle" style="color:#409EFF">锁屏设置</span>
        </template>
      </el-form-item>
      <el-form-item label="设置密码">
        <el-col :span="25">
          <el-input
            type="password"
            v-model="form.hideOrView"
            placeholder="请输入您的锁屏密码"
          />
        </el-col>
      </el-form-item>

      <el-form-item label="自动锁屏">
        <template #label>
          <div class="tipBox">
            <span>自动锁屏</span>
            <el-tooltip effect="dark" content="自动锁屏" placement="top">
              <el-icon><Warning /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input-number
          v-model="form.num"
          :min="0"
          :max="10"
          controls-position="right"
          @change="handleChange"
        />
        <div class="fz">分钟</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
const { ipcRenderer: ipc } =
  (window.require && window.require('electron')) || window.electron || {}
export default {
  props: ['data'],
  emits: ['LockSetting'],
  data() {
    return {
      form: {
        hideOrView: '',
        num: 0,
      },
    }
  },
  created() {},
  methods: {},
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
.fz {
  margin-left: 10px;
  font-size: 12px;
}
</style>
