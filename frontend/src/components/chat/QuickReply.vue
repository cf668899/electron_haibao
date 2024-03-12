<template>
  <div class="tab-box">
    <div class="tab-box-title">快捷回复</div>
    <div class="reply-box">
      <div :key="index" v-for="(item, index) in replys">
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="item.value"
          placement="right"
        >
          <el-button @click="copyReply(item)" style="width: 100%;">{{ item.title }}</el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
const { clipboard } = require('electron')
export default {
  props: ["data"],
  emits: ["reply",],
  data() {
    return {
      replys: [
        {
          title: "打招呼",
          value: "hello",
        },
        {
          title: "打招呼2",
          value: "hello world",
        },
        {
          title: "掘金",
          value: "掘金项目",
        },
      ],
    };
  },
  methods: {
    copyReply(item){
      clipboard.writeText(item.value, item.title)
      this.$emit("reply", this.data, item.value)
    }
  },
};
</script>
<style scoped>
.tab-box {
  text-align: left;
  padding: 15px 5px;
  width: 100%;
}

.tab-box-title {
  font-size: 15px;
  font-weight: 900;
}
.reply-box{
  padding-top: 10px;
}
.box-item {
  width: 100%;
}
</style>
