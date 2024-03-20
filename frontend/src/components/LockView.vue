<template>
    <div class="lock-box">
        <div class="unlock-box">
            <div class="logo">
                <el-image style="width: 200px; height: 220px" :src="lockLogoIcon" fit="fit" />
            </div>
            <div class="unlock-password">
                <el-space>
                    <el-input
                        v-model="password"
                        style="width: 300px;border-radius: 20px;"
                        type="password"
                        placeholder="输入解锁密码"
                        />

                        <el-button type="primary" @click="unLock" circle >
                            <el-icon><Right /></el-icon>
                        </el-button>
                </el-space>
            </div>
        </div>

        <div class="login-out">
            <el-link :underline="false" @click="()=>{$emit('loginOut')}">退出登录</el-link>
        </div>
    </div>
  </template>
  
  <script>
  const { ipcRenderer: ipc } = (window.require && window.require("electron")) || window.electron || {};
  import lockLogo from "@/assets/lock.png";
  export default {
    name: 'lockView',
    emits: ['unLock', 'loginOut'],
    data() {
      return {
        lockLogoIcon: lockLogo,
        password: "",
      };
    },
    methods: {
        unLock(){
            this.$emit('unLock', this.password)
        }
    },
  };
  </script>
  <style scoped>
  .lock-box{
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login-out {
    position: absolute;
    bottom: 10px;
    text-align: center;
    width: 100%; /* 如需要，可设置宽度 */
  }
  </style>
  