<template>
  <div class="tab-box">
    <div class="topBox">
      <div class="title">检查网络连接平台延迟</div>
      <el-button>检查更新</el-button>
    </div>
    <div class="centerBox">
      <div class="centerBoxItem" v-for="(item, index) in list" :key="index">
        <div :class="item.state ? 'djc ' + item.state : 'djc'">待检测</div>
        <div :class="item.state ? 'spanClass spanClassR' : 'spanClass'">
          Whatsapp
        </div>
        <div class="ycClass">{{ item.yc || '-' }}</div>
      </div>
    </div>
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
      list: [
        {
          name: 'Whatsapp',
        },
        {
          name: 'Whatsapp',
          state: 'quick',
          yc: '200ms',
        },
        {
          name: 'Whatsapp',
          state: 'notNet',
        },
        {
          name: 'Whatsapp',
          state: 'checkIng',
        },
        {
          name: 'Whatsapp',
        },
        {
          name: 'Whatsapp',
        },
        {
          name: 'Whatsapp',
        },
        {
          name: 'Whatsapp',
        },
      ],
    }
  },
  created() {},
  methods: {
  },
}
</script>
<style scoped>
.tab-box {
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 30px;
}
.topBox {
  display: flex;
  justify-content: space-between;
}
.title {
  font-weight: 600;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.88);
}
.centerBox {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 四个相等宽度的列 */
  grid-gap: 15px 13px;
  padding-top: 20px;
}
.centerBoxItem {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #ffffff;
  box-shadow: 2px 2px 8px 1px rgba(231, 231, 231, 0.5);
  min-height: 120px;
}
.spanClass {
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.25);
  margin-top: 10px;
}
.spanClassR {
  color: #000000;
}
.djc {
  background: rgba(0, 0, 0, 0.04);
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding: 5px 16px;
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.25);
  text-align: center;
  display: flex;
  align-items: center;
}
.quick {
  background: #52c41a;
  color: #ffffff;
  border: none !important;
}
.notNet {
  background: #ff4d4f;
  color: #ffffff;
  border: none !important;
}
.checkIng {
  background: #d8d8d8;
  color: #ffffff;
  border: none !important;
}
.ycClass {
  font-weight: 400;
  font-size: 12px;
  color: #6e6e6e;
  margin-top: 20px;
}
</style>
