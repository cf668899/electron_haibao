<template>
  <div class="body">
    <el-row>
      <el-col :span="12">
        <div class="grid-content ep-bg-purple-left">
          <div class="image-body">
            <el-image
              style="width: 150px; height: 150px"
              :src="loginLogoIcon"
              fit="contain"
            />
          </div>

          <div class="title-body">
            <div class="title">Login to you account</div>
            <p style="font-size:12px;color:rgb(173,173,173)">
              login now to access the latest insights experience for your social
              media
            </p>
          </div>

          <div class="token-body">
            <div><el-text size="small">邀请码</el-text></div>
            <el-input
              v-model="config.token"
              class="w-50 m-2"
              size="large"
              placeholder="请输入邀请码"
            />

            <el-row>
              <el-col :span="12">
                <div class="daili">
                  <img src="@/assets/int.png" class="iconImage" />
                </div>
              </el-col>
              <el-col :span="12">
                <div class="text-right">
                  <el-checkbox
                    v-model="config.isSaveLogin"
                    label="保持登陆"
                    size="large"
                  />
                </div>
              </el-col>
            </el-row>
          </div>

          <div class="login-btn">
            <el-button
              type="primary"
              style="width: 100%; height: 40px"
              @click="handlerLogin"
              >登陆</el-button
            >
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content ep-bg-purple-right">
          <el-image :src="beijinIcon" style="height:100%;display:flex;"></el-image>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
const { ipcRenderer: ipc } =
  (window.require && window.require("electron")) || window.electron || {};
import { login } from "@/api/admin";
import loginLogo from "@/assets/login_logo.png";
import beijin from "@/assets/beijin.png";
import { ElMessage } from "element-plus";
export default {
  data() {
    return {
      loginLogoIcon: loginLogo,
      beijinIcon: beijin,
      test: "",
      config: {
        token: "SAC0PZBYXS7U",
        isSaveLogin: false,
      }, 
    };
  },
  created() {
    ipc.invoke("controller.login.getLoginData", {}).then((res) => {
      if (res && res.isSaveLogin) {
        console.log(res)
        this.config = res
      }
    }); 
  },
  methods: {
    async handlerLogin() {
      if (!this.config.token) {
        ElMessage.error("邀请码不能为空!");
        return;
      }
      const machineId = await ipc.invoke("controller.app.getMachineId", {})
      await login({
        inviteCode: this.config.token,
        deviceId: machineId
      });
      ipc.invoke("controller.login.login", { ...this.config }).then((res) => {
        this.$router.push({ name: "home" });
      });
    },
  },
};
</script>
<style scoped>
.iconImage{
  width: 20px;
  height: 20px;
}
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
