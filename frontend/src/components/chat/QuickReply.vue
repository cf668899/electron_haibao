<template>
  <div class="tab-box">
    <div class="reply-box">
      <div class="tab-box-title">快捷回复
        <el-tooltip effect="dark" content="单机输入框进行翻译，双击直接发送原文" placement="top-start">
          <el-icon>
            <QuestionFilled />
          </el-icon>
        </el-tooltip>
      </div>

      <el-input v-model="searchText" class="w-50 m-2" placeholder="请输入标题或者关键内容过滤" @input="searchChange">
        <template #suffix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>

      <div class="collapse-box">
        <el-collapse v-model="activeGroupName" accordion style="background-color: antiquewhite;" >
          <el-collapse-item :title="item.groupName" :name="item.groupName" v-for="item in group" :key="item.groupName">
            <div class="collapse-item" v-for="it in item.replays" :key="it.title" @click="copyReply(it)">
              <el-card >
                <div>{{ it.title }}</div>
                <div>{{ it.value }}</div>
              </el-card>
            </div>
          </el-collapse-item>
      </el-collapse>
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
      searchText: "",
      activeGroupName: "",
      group: [
        {
          groupName: "测试",
          replays: [
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
          ]
        }
      ],
      oldGroup:[
        {
          groupName: "测试",
          replays: [
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
          ]
        }
      ]
    };
  },
  methods: {
    copyReply(item) {
      clipboard.writeText(item.value, item.title)
      this.$emit("reply", this.data, item.value)
    },
    searchChange(text){
      console.log(text)
      if(!text){
        this.group = this.oldGroup
        return
      }

      let newList = []
      this.oldGroup.forEach(item=>{
        for(let it of item.replays){
          if(it.title.indexOf(text)>-1 || it.value.indexOf(text) > -1){
            newList.push(item)
            return
          }
        }
      })

      this.group = newList
    }
  },
};
</script>
<style scoped>
.tab-box {
  text-align: left;
  width: 100%;
}

.tab-box-title {
  font-size: 15px;
  font-weight: 900;
}

.reply-box {
  padding-top: 10px;
  width: 95%;
  margin: 0 auto;
}

.box-item {
  width: 100%;
}
.collapse-box{
  padding: 0 15px;
  background-color: #fff;
}
</style>
