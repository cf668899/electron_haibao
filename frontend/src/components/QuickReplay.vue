<template>
  <div class="box">
    <div class="box-left">
      <div class="left-top">
        <div class="left-top-left">快捷分组</div>
        <el-icon size="15" class="addGroupIcon" @click="addGroup()"
          ><Plus
        /></el-icon>
      </div>
      <el-input
        v-model="keyWord"
        placeholder="请输入分组名称过滤"
        :suffix-icon="Search"
        class="inputClass" />
      <div class="groupClass">
        <div
          :class="{
            groupClassItem: true,
            activeItem: activeIndex == index,
            isNotZero: index !== 0,
          }"
          v-for="(item, index) in currentGroupList"
          :key="index"
          @click="clickGroupItem(index)">
          <div class="groupClassItemLeft">
            {{ item.name }}
          </div>
          <div class="groupClassItemRight">
            <el-icon @click="editGroup(item, index)" class="editIcon" size="12"
              ><EditPen
            /></el-icon>
            <el-icon size="12" @click="deleteGroupItem(index)"
              ><Delete
            /></el-icon>
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
          <div style="color: #409eff" class="downMb" @click="getDemoExcel">
            下载模版
          </div>
        </div>

        <el-upload
          class="upload-demo"
          action=""
          :show-file-list="false"
          :on-change="handleChange"
          :limit="1"
          :auto-upload="false"
          :file-list="[]">
          <el-button
            :icon="FolderRemove"
            size="small"
            class="commonButton"
            style="margin-left: 10px"
            >我要导入</el-button
          >
        </el-upload>

        <el-button
          :icon="FolderRemove"
          size="small"
          class="commonButton"
          style="margin-left: 10px"
          @click="exportExcel"
          >我要导出</el-button
        >
        <el-button
          size="small"
          class="commonButton"
          style="margin-left: 10px"
          @click="clearAllBack()"
          >清空回复</el-button
        >
      </div>
      <el-table :data="currentList" class="tableClass" style="margin-top: 10px">
        <el-table-column prop="date" label="序号" type="index" width="70" />
        <el-table-column prop="bz" label="备注" />
        <el-table-column prop="content" label="内容" />
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="edit(scope.row, scope.$index)"
              >修改</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="deleteItem(scope.$index)"
              >删除</el-button
            >
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

    <el-dialog v-model="dialogGroupFormVisible" title="分组" width="500">
      <el-form :model="groupForm" :rules="groupRules" ref="groupFormRef">
        <el-form-item prop="name" label="分组名称">
          <el-input v-model="groupForm.name" placeholder="请输入分组名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirmGroup"> 保存 </el-button>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import ExcelJS from 'exceljs'
import FileSaver from 'file-saver'
const { ipcRenderer: ipc } =
  (window.require && window.require('electron')) || window.electron || {}
import emitter from '@/utils/bus'
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
      groupForm: {},
      dialogFormVisible: false,
      dialogGroupFormVisible: false,
      rules: {
        bz: [{ required: true, message: '备注不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
      },
      groupRules: {
        name: [
          { required: true, message: '分组名称不能为空', trigger: 'blur' },
        ],
      },
      isEdit: false,
      isGroupEdit: false,
      editIndex: -1,
      groupList: [],
      activeIndex: -1,
      keyWord: '',
    }
  },
  computed: {
    currentGroupList() {
      if (this.groupList && this.groupList.length > 0) {
        return this.groupList.filter((i) => i.name.includes(this.keyWord))
      }
      return []
    },
    currentList() {
      if (
        this.activeIndex == -1 ||
        !(this.groupList && this.groupList.length > 0)
      ) {
        return []
      }
      return this.groupList[this.activeIndex].data || []
    },
    isDisable() {
      return this.activeIndex === -1
    },
  },
  async created() {
    await this.getCommonStorage()
    if (this.groupList && this.groupList.length > 0) {
      this.activeIndex = 0
    }
  },
  methods: {
    clickGroupItem(index) {
      this.activeIndex = index
    },
    add() {
      if (this.activeIndex === -1) {
        ElMessage({
          type: 'warning',
          message: '请选择分组',
        })
        return
      }
      this.form = {}
      this.dialogFormVisible = true
      this.isEdit = false
    },
    saveStorage() {
      ipc.invoke('controller.app.setCommonStorage', {
        data: JSON.stringify(this.groupList),
        key: 'QuickReplay',
      })
      this.getCommonStorage()
      emitter.emit('quick-reply')
    },
    async getCommonStorage() {
      const res = await ipc.invoke('controller.app.getCommonStorage', {
        key: 'QuickReplay',
      })
      if (res && res.length > 0) {
        this.groupList = JSON.parse(res)
      }
    },
    confirm() {
      this.$refs.formRef.validate((valid, fields) => {
        if (valid) {
          if (this.isEdit) {
            this.groupList[this.activeIndex].data[this.editIndex] = this.form
            ElMessage({
              type: 'success',
              message: '修改成功!',
            })
          } else {
            if (!this.groupList[this.activeIndex].data) {
              this.groupList[this.activeIndex].data = []
            }
            this.groupList[this.activeIndex].data.push(this.form)
            ElMessage({
              type: 'success',
              message: '新增成功!',
            })
          }
          this.form = {}
          this.dialogFormVisible = false
          this.saveStorage()
        } else {
          console.log('error submit!', fields)
        }
      })
    },
    deleteItem(index) {
      ElMessageBox.confirm('是否删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let list = this.groupList[this.activeIndex].data
        this.groupList[this.activeIndex].data.splice(index, 1)
        ElMessage({
          type: 'success',
          message: '删除成功!',
        })
        this.saveStorage()
      })
    },
    edit(item, index) {
      this.dialogFormVisible = true
      this.form = JSON.parse(JSON.stringify(item))
      this.isEdit = true
      this.editIndex = index
    },
    addGroup() {
      this.dialogGroupFormVisible = true
      this.isGroupEdit = false
    },
    editGroup(item, index) {
      this.dialogGroupFormVisible = true
      this.isGroupEdit = true
      this.groupForm = JSON.parse(JSON.stringify(item))
      this.groupForm.index = index
    },
    confirmGroup() {
      this.$refs.groupFormRef.validate((valid, fields) => {
        if (valid) {
          if (this.isGroupEdit) {
            this.groupList[this.groupForm.index].name = this.groupForm.name
            ElMessage({
              type: 'success',
              message: '修改成功!',
            })
            this.dialogGroupFormVisible = false
          } else {
            this.groupList.push({
              name: this.groupForm.name,
              data: [],
            })
            ElMessage({
              type: 'success',
              message: '新增成功!',
            })
            this.dialogGroupFormVisible = false
          }
          this.saveStorage()
          this.form = {}
          this.dialogFormVisible = false
        } else {
          console.log('error submit!', fields)
        }
      })
    },
    deleteGroupItem(index) {
      ElMessageBox.confirm('是否删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (index === this.activeIndex) {
          this.activeIndex = -1
        }
        this.groupList.splice(index, 1)
        ElMessage({
          type: 'success',
          message: '删除成功!',
        })
        this.saveStorage()
      })
    },
    clearAllBack() {
      if (this.activeIndex === -1) {
        ElMessage({
          type: 'warning',
          message: '请选择分组',
        })
        return
      }
      ElMessageBox.confirm('是否清空回复', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.groupList[this.activeIndex].data = []
        this.saveStorage()
        ElMessage({
          type: 'success',
          message: '操作成功!',
        })
      })
    },
    handleChange(file) {
      if (this.activeIndex === -1) {
        ElMessage({
          type: 'warning',
          message: '请选择分组',
        })
        return
      }
      let nameSplit = file.name.split('.')
      let format = nameSplit[nameSplit.length - 1]
      if (!['xlsx', 'csv'].includes(format)) {
        return false
      }
      file = file.raw
      const fileReader = new FileReader()
      fileReader.readAsArrayBuffer(file)
      fileReader.onload = (ev) => {
        try {
          console.log('345')
          const data = ev.target.result
          let XLSX = require('xlsx')
          const workbook = XLSX.read(data, {
            type: 'binary', // 以字符编码的方式解析
          })
          const exlname = workbook.SheetNames[0] // 取第一张表
          const exl = XLSX.utils.sheet_to_json(workbook.Sheets[exlname]) // 生成json表格内容
          console.log('exl==', exl)
          for (let item of exl) {
            if (item['内容'] && item['备注']) {
              this.groupList[this.activeIndex].data.push({
                content: item['内容'],
                bz: item['备注'],
              })
            }
          }
          this.saveStorage()
          // 获取json数据，批量导入数据库，并刷新表格
        } catch (e) {
          console.log('e==', e)
          return false
        }
      }
    },
    getDemoExcel() {
      const workbook = new ExcelJS.Workbook()
      // 添加工作表，名为sheet1
      const sheet1 = workbook.addWorksheet('sheet1')
      // 导出数据列表
      let data = [
        {
          备注: '',
          内容: '',
        },
      ]
      // 获取表头所有键
      const headers = Object.keys(data[0])
      // 将标题写入第一行
      sheet1.addRow(headers)
      // 将数据写入工作表
      data.forEach((row) => {
        const values = Object.values(row)
        sheet1.addRow(values)
      })
      // 导出表格文件
      workbook.xlsx
        .writeBuffer()
        .then((buffer) => {
          let file = new Blob([buffer], { type: 'application/octet-stream' })
          FileSaver.saveAs(file, '快捷回复模版.xlsx')
        })
        .catch((error) => console.log('Error writing excel export', error))
    },
    exportExcel() {
      if (this.activeIndex === -1) {
        ElMessage({
          type: 'warning',
          message: '请选择分组',
        })
        return
      }
      const workbook = new ExcelJS.Workbook()
      // 添加工作表，名为sheet1
      const sheet1 = workbook.addWorksheet('sheet1')
      // 导出数据列表
      const data = []
      let list = this.groupList[this.activeIndex].data
      for (let item of list) {
        data.push({
          备注: item.bz,
          内容: item.content,
        })
      }
      // 获取表头所有键
      const headers = Object.keys(data[0])
      // 将标题写入第一行
      sheet1.addRow(headers)
      // 将数据写入工作表
      data.forEach((row) => {
        const values = Object.values(row)
        sheet1.addRow(values)
      })
      // 导出表格文件
      workbook.xlsx
        .writeBuffer()
        .then((buffer) => {
          let file = new Blob([buffer], { type: 'application/octet-stream' })
          FileSaver.saveAs(file, 'ExcelJS.xlsx')
        })
        .catch((error) => console.log('Error writing excel export', error))
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
.addGroupIcon {
  cursor: pointer;
}
.downMb {
  cursor: pointer;
}
</style>
