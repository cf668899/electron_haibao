<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px" style="background-color: antiquewhite;">
        菜单
      </el-aside>
      <el-main>
        内容
      </el-main>
    </el-container>
  </div>
  </template>
  <script>
  
  export default {
    data() {
      return {
        test: '',
      };
    },
    methods: {
      test () {
        // 
      },
    }
  };
  </script>
  <style scoped>
  .common-layout {
    height: 100%;
  }

  .el-container{
    height: 100%;
  }
  </style>
    