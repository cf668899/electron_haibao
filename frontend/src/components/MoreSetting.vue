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
        翻译设置
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Aim /></el-icon>
            <span>代理设置</span>
          </span>
        </template>
        代理设置
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
            <span>锁屏设置</span>
          </span>
        </template>
        锁屏设置
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Setting /></el-icon>
            <span>软件设置</span>
          </span>
        </template>
        软件设置
      </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
export default {
  name: "moreSetting",
  data() {
    return {
      test: "",
    };
  },
};
</script>
<style scoped>
.header-box {
  text-align: left;
  width: 100%;
  display: flex;
  align-items: center;
  padding-top: 5px;
  padding-left: 15px;
  padding-bottom: 5px;
}
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
.setting-box{
  margin: 0 10px;
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
