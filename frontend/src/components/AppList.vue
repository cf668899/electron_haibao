<template>
  <el-container class="common-layout">
    <el-header style="padding-bottom:5px;height:35px;">
      <div class="header-box">
        <div style="font-size: 15px;margin-left:15px;">会话列表</div>
        <div style="padding-left: 20px">
          <el-tag type="success" effect="dark">{{
            `会话:${appNum} / ${appLimit}`
          }}</el-tag>
        </div>
        <div class="addAppBtn" @click="addApp">
          <el-icon size="12"><Aim /></el-icon> 新增:{{ appType }}
        </div>
      </div>
    </el-header>
    <el-main>
      <el-card class="box-card">
        <el-table :data="list" style="width: 100%" size="small" show-overflow-tooltip >
          <el-table-column
            label="序号"
            type="index"
            :index="indexMethod"
            width="40"
          />
          <el-table-column prop="createTime" label="创建于" width="150" />
          <el-table-column prop="updateTime" label="最后修改" width="150" />
          <el-table-column prop="record" label="会话记录" width="180" >
            <template #default="scope">
              <el-space wrap class="alignClass">
                <div :class="scope.row.online?'online online-box':'online-box'"></div>
                <el-avatar :size="20" :src="scope.row.avatar" />
                <div>
                  {{ scope.row.record? scope.row.record: appType + " " + (list.length - scope.$index)}}
                </div>
              </el-space>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="用户名" width="auto" />
          <el-table-column prop="remark" label="备注信息" width="auto" >
            <template #default="scope">
              <div class="remark">
                <span v-if="!scope.row.isEdit">
                  {{ scope.row.remark }} 
                  <el-button  @click="toEdit(scope.row)" style="padding: 0;"  text><el-icon size="15" color="#409EFF" ><Edit /></el-icon></el-button> 
                </span>
                <el-input @blur="remarkEditBlur(scope.row)" v-model="scope.row.remark" v-if="scope.row.isEdit">
              </el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template #default="scope">
              <el-button
                v-if="scope.row.isActive"
                size="small"
                type="success"
                @click="$emit('showApp', scope.row)"
                >显示</el-button
              >
              <el-button
                v-if="scope.row.isActive"
                size="small"
                type="warning"
                @click="$emit('closeApp', scope.row)"
                >关闭</el-button
              >
              <el-button
                v-if="!scope.row.isActive"
                size="small"
                type="primary"
                @click="$emit('startApp', scope.row)"
                >启动</el-button
              >
              <el-button
                v-if="!scope.row.isActive"
                size="small"
                type="danger"
                @click="$emit('delApp', scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
const { ipcRenderer: ipc } = (window.require && window.require("electron")) || window.electron || {};
export default {
  name: "applist",
  props: ["appType", "list", "appNum", "appLimit"],
  emits: ["addApp", "startApp", "showApp", "closeApp", "delApp"],
  data() {
    return {
      test: "",
    };
  },
  methods: {
    indexMethod(index) {
      return this.list.length - index;
    },
    toEdit(row){
      row.isEdit = true
    },
    remarkEditBlur(row){
      console.log(row)
      row.isEdit = false
      ipc.invoke('controller.app.changeRemark', JSON.parse(JSON.stringify(row)))
    },
    addApp(){
      this.$emit('addApp', {
        name:'',
        type: this.appType,
        isActive: false,
      })
    }
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
.addAppBtn {
  font-size: 15px;
  color: #409eff;
  margin-left: 50px;
  border-bottom: #409eff 2px solid;
  cursor: pointer;
}
.online-box {
  width: 5px;
  height: 5px;
  border-radius: 5px;
  background-color: rgb(99, 101, 103);
}
.online {
  background-color: #409EFF;
}
.remark{
  display: flex;
  align-items: center;
}
.box-card{
  height: 100%;
  overflow: auto;
}
.alignClass{
  display: flex;
  align-items: center;
}
</style>
