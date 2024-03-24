<template>
  <div class="tab-box">
    <div class="reply-box">
      <div class="tab-box-title">
        快捷回复
        <el-tooltip
          effect="dark"
          content="单机输入框进行翻译，双击直接发送原文"
          placement="top-start"
        >
          <el-icon>
            <QuestionFilled />
          </el-icon>
        </el-tooltip>
      </div>

      <el-input
        v-model="searchText"
        class="w-50 m-2 input"
        placeholder="请输入标题或者关键内容过滤"
        @input="changeText"
      >
        <template #suffix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>

      <div class="collapse-box">
        <el-collapse
          v-model="activeGroupName"
          accordion
          style="background-color: antiquewhite"
        >
          <el-collapse-item
            :title="item.name"
            :name="item.name"
            v-for="item in newList"
            :key="item.name"
          >
            <div
              class="collapse-item"
              v-for="it in item.data"
              :key="it.bz"
              @click="copyReply(it)"
            >
              <el-card>
                <div>{{ it.bz }}</div>
                <div>{{ it.content }}</div>
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
const { ipcRenderer: ipc } =
  (window.require && window.require('electron')) || window.electron || {}
import emitter from '@/utils/bus'
import _ from 'lodash'
export default {
  props: ['data', 'tabValue'],
  emits: ['reply'],
  data() {
    return {
      searchText: '',
      activeGroupName: '',
      group: [],
    }
  },
  watch: {
    tabValue() {
      this.getCommonStorage()
    },
  },
  created() {
    this.getCommonStorage()
    emitter.on('quick-reply', () => {
      this.getCommonStorage()
    })
  },
  computed: {
    newList() {
      if (!this.searchText) {
        return this.group
      }
      let list = _.cloneDeep(this.group)
      for (let i = 0; i < list.length; i++) {
        let list2 = list[i].data.filter(
          (i) =>
            i.bz.includes(this.searchText) ||
            i.content.includes(this.searchText)
        )
        if (list2 && list2.length > 0) {
          list[i].data = list2
        } else {
          if (!list[i].name.includes(this.searchText)) {
            list.splice(i)
          }else{
            list[i].data = this.group[i].data
          }
        }
      }
      return list
    },
  },
  methods: {
    async getCommonStorage() {
      const res = await ipc.invoke('controller.app.getCommonStorage', {
        key: 'QuickReplay',
      })
      if (res && res.length > 0) {
        this.group = JSON.parse(res)
      }
    },
    copyReply(item) {
      clipboard.writeText(item.content, item.bz)
    },
    changeText(e) {
      this.searchText = e
    },
  },
}
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
.collapse-box {
  padding: 0 15px;
  background-color: #fff;
}
.input {
  margin-top: 10px;
}
</style>
