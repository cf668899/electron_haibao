<template>
  <div class="tab-box">
    <el-form label-position="left" label-width="180px" style="width: 100%">
      <el-form-item>
        <template #label>
          <span class="commonTitle" style="color: #409eff">软件设置</span>
        </template>
      </el-form-item>
      <el-form-item label="浮动控制">
        <template #label>
          <div class="tipBox">
            <span>浮动控制</span>
            <el-tooltip
              effect="dark"
              content="浮动控制的按钮的功能会显示更多快捷设置，包括快捷回复"
              placement="top"
            >
              <el-icon><Warning /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-switch v-model="form.fd" />
      </el-form-item>
      <el-form-item label="会话文本显示">
        <el-select
          placeholder="请选择"
          class="form-item"
          v-model="form.text"
          style="width: 265px"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in viewType"
            :key="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="翻译字体">
        <span style="margin-right: 10px">颜色</span>
        <el-color-picker v-model="form.color" class="colorSelect" />
      </el-form-item>

      <el-form-item>
        <span style="margin-right: 10px">大小</span>
        <el-input-number
          style="width: 225px"
          v-model="form.num"
          :min="0"
          :max="10"
          controls-position="right"
          @change="handleChange"
        />
        <span style="margin-left: 10px">px</span>
      </el-form-item>

      <el-form-item>
        <span style="margin-right: 10px">加粗</span>
        <el-select
          placeholder="请选择"
          class="form-item"
          v-model="form.jcType"
          style="width: 225px"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in jcType"
            :key="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="浏览器UA">
        <template #label>
          <div class="tipBox">
            <span>浮动控制</span>
            <el-tooltip
              effect="dark"
              content="只对新增的会话生效"
              placement="top"
            >
              <el-icon><Warning /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input v-model="form.ua" style="width: 174px" />
        <el-button type="primary" style="margin-left: 10px">重置UA</el-button>
      </el-form-item>

      <el-form-item label="软件版本">
        <el-button type="primary">检查更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
const { ipcRenderer: ipc } =
  (window.require && window.require('electron')) || window.electron || {}
export default {
  props: ['data'],
  emits: ['SoftSetting'],
  data() {
    return {
      form: {
        fd: '',
        num: 0,
        text: '',
        jcType: '',
        ua: 'Apple MacOs',
      },
      viewType: [
        {
          label: '用户名',
          value: '1',
        },
        {
          label: '备注',
          value: '2',
        },
      ],
      jcType: [
        {
          label: '常规',
          value: '1',
        },
        {
          label: '粗体',
          value: '2',
        },
      ],
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
