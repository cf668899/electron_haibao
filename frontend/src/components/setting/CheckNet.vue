<template>
  <div class="tab-box">
    <div class="topBox">
      <div class="title">
        <span style="color: #409eff; margin-right: 10px">支持平台</span
        ><span>自定义左侧栏显示的平台(可拖拽更换顺序)</span>
      </div>
    </div>
    <draggable
      v-model="newList"
      group="list"
      item-key="name"
      class="centerBox"
      @change="changeDrag"
    >
      <template #item="{ element: item }">
        <div class="centerBoxItem" :key="item.name">
          <el-checkbox
            v-model="item.used"
            size="large"
            @change="updateData(item)"
            :disabled ="!checkApplicationEnable(item.name)"
          />
          <img class="iconImg" :src="item.image" />
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import WhatsappIcon from '@/assets/whatsapp.png'
import TelegramIcon from '@/assets/Telegram.png'
const { ipcRenderer: ipc } =
  (window.require && window.require('electron')) || window.electron || {}
export default {
  props: ['appTypes','appList'],
  emits: ['changeTranslateSetting'],
  components: {
    draggable,
  },
  data() {
    return {
      drag: false,
    }
  },
  computed: {
    newList(){
      if(this.appTypes && this.appTypes.length>0){
      return this.appTypes.filter(i=>i.show)
      }
      return []
    }
  },
  methods: {
    updateData(item) {
      let index = -1
      for(let i=0;i<this.appTypes.length;i++){
        if(item.name === this.appTypes[i].name){
          index = i
        }
      }
      let newList = JSON.parse(JSON.stringify(this.appTypes))
      newList[index].used = item.used
      this.$emit('updateAppTypes', newList)
    },
    changeDrag(data) {
      let newList = JSON.parse(JSON.stringify(this.appTypes))
      let newItem = data.moved.element
      let oldItem = JSON.parse(JSON.stringify(newList[data.moved.newIndex]))
      newList[data.moved.newIndex] = newItem
      newList[data.moved.oldIndex] = oldItem
      this.$emit('updateAppTypes', newList)
    },
    checkApplicationEnable(name){
      if(this.appList && this.appList[name] && this.appList[name].find(i=>i.isActive)){
        return false;
      }
      return true;
    }
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
}
.centerBox {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 四个相等宽度的列 */
  grid-gap: 1px 1px;
  padding-top: 20px;
}
.centerBoxItem {
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  box-shadow: 2px 2px 2px 2px rgba(231, 231, 231, 0.5);
  min-height: 80px;
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
.iconImg {
  width: 50px;
  margin-left: 20px;
}
</style>
