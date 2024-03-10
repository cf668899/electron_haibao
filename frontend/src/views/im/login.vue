<template>
  <div class="body">
    <el-row>
      <el-col :span="12">
        <div class="grid-content ep-bg-purple-left">
          <div class="image-body">
            <el-image style="width: 150px; height: 150px" :src="loginLogoIcon"
              fit="contain" />
          </div>

          <div class="title-body">
            <div class="title">Login to you account</div>
            <p>
              login now to access the latest insights experience for your social
              media
            </p>
          </div>

          <div class="token-body">
            <div><el-text size="small">邀请码</el-text></div>
            <el-input v-model="config.token" class="w-50 m-2" size="large" placeholder="请输入邀请码" />

            <el-row>
              <el-col :span="12">
                <div class="daili">
                  <el-icon size="20"><Aim /></el-icon>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="text-right" >
                  <el-checkbox v-model="config.isSaveLogin" label="保持登陆" size="large" />
                </div>
              </el-col>
            </el-row>
          </div>

          <div class="login-btn">
            <el-button type="primary" style="width: 100%; height: 40px;" @click="handlerLogin" >登陆</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content ep-bg-purple-right">
          <el-image :src="beijinIcon" fit="fit"></el-image>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
const { ipcRenderer: ipc } = (window.require && window.require('electron')) || window.electron || {};
import {login} from "@/api/admin"
import loginLogo from "@/assets/login_logo.png";
import beijin from "@/assets/beijin.png";
export default {
  data() {
    return {
      loginLogoIcon:loginLogo,
      beijinIcon:beijin,
      test: "",
      config:{
        token:"",
        isSaveLogin:false
      }
    };
  },
  methods: {
    async handlerLogin(){
      console.log("登陆")
      // const res = await login();
      ipc.invoke('controller.login.login', {name:"zhangsan"}).then(res => {
        console.log(res)
        this.$router.push({name:"home"})
      })
    }
  },
};
</script>
<style scoped>
.body {
  height: 100%;
}

.el-row {
  height: 100%;
}

.grid-content {
  width: 100%;
  height: 100%;
}

.ep-bg-purple-left {
  height: 100%;
  width: 80%;
  text-align: left;
  padding-left: 50px;
  padding-right: 50px;
  /* background-color: aquamarine; */
}

.image-body {
  /* padding-top: 50px; */
}

.title-body {
  /* padding-top: 50px; */
}

.title {
  font-size: 25px;
  font-weight: 900;
}

.token-body {
  padding-top: 50px;
}
.text-right {
  text-align: right;
}

.daili {
  line-height: 40px;
}
.ep-bg-purple-right {
  background-color: azure;
  /* background: url('@/assets/beijin.png') */
}
.login-btn {
  width: 100%;
  
}
</style>
