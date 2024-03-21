<template>
  <div class="box">
    <div class="box-left">
      <div class="left-top">
        <div class="left-top-left">快捷分组</div>
        <el-icon size="15"><Plus /></el-icon>
      </div>
      <el-input
        v-model="input2"
        placeholder="请输入分组名称过滤"
        :suffix-icon="Search"
        class="inputClass"
      />
      <div class="groupClass">
        <div
          :class="{
            groupClassItem: true,
            activeItem: activeKey === item.key,
            isNotZero: index !== 0,
          }"
          v-for="(item, index) in groupList"
          :key="index"
          @click="clickGroupItem(item)"
        >
          <div class="groupClassItemLeft">
            {{ item.name }}
          </div>
          <div class="groupClassItemRight">
            <el-icon class="editIcon" size="12"><EditPen /></el-icon>
            <el-icon size="12"><Delete /></el-icon>
          </div>
        </div>
      </div>
    </div>
    <div class="box-right">
      <div class="box-right-top">
        <el-button
          class="commonButton"
          type="success"
          :icon="CirclePlusFilled"
          size="small"
          @click="add"
          >新增快捷回复</el-button
        >
        <div class="centerBox">
          <div class="circleClass" />
          预先设置一些常见问题的回复用语, 帮助您提高回复效率。
          <div style="color: #409eff">下载模版</div>
        </div>
        <el-button
          type="primary"
          :icon="FolderAdd"
          size="small"
          class="commonButton"
          style="margin-left: 10px"
          >我要导入</el-button
        >
        <el-button
          :icon="FolderRemove"
          size="small"
          class="commonButton"
          style="margin-left: 10px"
          >我要导出</el-button
        >
        <el-button size="small" class="commonButton" style="margin-left: 10px"
          >清空回复</el-button
        >
      </div>
      <el-table :data="currentList" class="tableClass" style="margin-top: 10px">
        <el-table-column prop="date" label="序号" type="index" width="70" />
        <el-table-column prop="bz" label="备注" />
        <el-table-column prop="content" label="内容" />
        <el-table-column fixed="right" label="操作" width="150">
          <template #default>
            <el-button type="primary" size="small" @click="handleClick"
              >修改</el-button
            >
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="dialogFormVisible" title="快捷回复" width="500">
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="bz" label="备注">
          <el-input v-model="form.bz" />
        </el-form-item>
        <el-form-item prop="content" label="内容">
          <el-input :rows="4" type="textarea" v-model="form.content" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirm"> 保存 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  Search,
  CirclePlusFilled,
  FolderAdd,
  FolderRemove,
} from '@element-plus/icons-vue'
const { ipcRenderer: ipc } =
  (window.require && window.require('electron')) || window.electron || {}
export default {
  name: 'QuickReplay',
  components: {},
  data() {
    return {
      Search,
      CirclePlusFilled,
      FolderAdd,
      FolderRemove,
      form: {},
      dialogFormVisible: false,
      rules: {
        bz: [{ required: true, message: '备注不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
      },
      groupList: [
        {
          name: '123',
          key: '123',
          data: [
            {
              bz: '123',
              content: '123123',
            },
            {
              bz: '1234',
              content: '123123',
            },
          ],
        },
        {
          name: '未分组',
          key: '未分组',
          data: [
            {
              bz: '122223',
              content: '123123',
            },
            {
              bz: '12234',
              content: '123123',
            },
          ],
        },
      ],
      activeKey: '',
    }
  },
  computed: {
    currentList() {
      for (let item of this.groupList) {
        if (item.key === this.activeKey) {
          return item.data
        }
      }
      return []
    },
  },
  created() {
    this.activeKey = this.groupList[0].key
  },
  methods: {
    clickGroupItem(item) {
      this.activeKey = item.key
    },
    add() {
      this.dialogFormVisible = true
    },
    confirm() {
      this.$refs.formRef.validate((valid, fields) => {
        if (valid) {
          console.log('submit!')
          for (let item of this.groupList) {
            if (item.key === this.activeKey) {
              item.data.push(this.form)
            }
          }
          this.form = {}
          this.dialogFormVisible = false
        } else {
          console.log('error submit!', fields)
        }
      })
    },
  },
}
</script>
<style scoped>
.box {
  display: flex;
  background-color: rgb(241, 242, 246);
  padding: 10px 10px 2px 10px;
  width: calc(100% - 20px);
  height: calc(100% - 15px);
}
.box-left {
  width: 200px !important;
  background-color: #fff;
  height: 100%;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
}
.box-right {
  width: calc(100% - 220px);
  height: 100%;
}
.left-top {
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 20px;
  align-items: center;
}
.left-top-left {
  font-size: 16px;
  font-weight: 500;
}
.inputClass {
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 15px;
  font-size: 12px;
}
.groupClass {
  flex: 1;
  margin-top: 10px;
}
.groupClassItem {
  display: flex;
  justify-content: space-between;
  padding: 10px 10px 10px 10px;
  align-items: center;
  cursor: pointer;
}
.groupClassItemLeft {
  font-size: 12px;
}
.editIcon {
  margin-right: 10px;
}
.activeItem {
  background-color: rgb(244, 244, 244);
}
.groupClassItem:hover {
  background-color: rgb(244, 244, 244);
}
.isNotZero {
  border-top: solid 1px rgb(234, 234, 234);
}
.circleClass {
  width: 5px;
  height: 5px;
  border-radius: 100%;
  background-color: #67c23a;
  margin-left: 10px;
  margin-right: 5px;
}
.box-right-top {
  display: flex;
  align-items: center;
}
.centerBox {
  display: flex;
  align-items: center;
  font-size: 10px;
}
.commonButton {
  height: 20px;
  font-size: 10px;
}
.tableClass {
  width: 100%;
}
</style>
