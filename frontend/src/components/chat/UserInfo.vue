<template>
    <div class="tab-box">
      <div class="tab-box-title">联系人信息</div>
      <el-form label-position="left" label-width="60px">
            <el-form-item label="手机号">
                <el-input v-model="contactUserInfo.phone"   class="form-item"/>
            </el-form-item>
            <el-form-item label="昵称">
                <el-input v-model="contactUserInfo.nickName"   class="form-item"/>
            </el-form-item>
            <el-form-item label="国家">
                <el-input v-model="contactUserInfo.country"   class="form-item"/>
            </el-form-item>
            <el-form-item label="性别">
                <el-radio-group v-model="contactUserInfo.sex" class="ml-4">
                    <el-radio label="男" size="large">男</el-radio>
                    <el-radio label="女" size="large">女</el-radio>
                </el-radio-group>
            </el-form-item>
    </el-form>

    <el-divider />

    <div class="tab-box-title">销售信息</div>
    <el-form label-position="left" label-width="80px">
            <el-form-item label="交易活动">
                <el-select v-model="contactUserInfo.activity" placeholder="请选择" class="form-item2" >
                    <el-option :label="item.name" :value="item.value" v-for="item in activitys" :key="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="客户等级">
                <el-select v-model="contactUserInfo.grade" placeholder="请选择" class="form-item2" >
                    <el-option :label="item.name" :value="item.value" v-for="item in grades" :key="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="备注">
                <el-input :rows="3" type="textarea" v-model="contactUserInfo.remark"  class="form-item2"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="changeFriendInfo">保存</el-button>
            </el-form-item>
    </el-form>

    </div>
  </template>
  
  <script>
  export default {
    props: ["data"],
    emits: ["changeFriendInfo"],
    data() {
      return {
        contactUserInfo:{
            phone:""
        },
        activitys:[
            {
                name:"测试活动",
                value:"测试活动"
            }
        ],
        grades:[
            {
                name:"等级一",
                value:"等级一"
            },
            {
                name:"等级二",
                value:"等级二"
            },
            {
                name:"等级三",
                value:"等级三"
            }
        ]
      };
    },
    methods: {
        changeFriendInfo(){
            this.$emit('changeFriendInfo', this.contactUserInfo)
        },
        openChange(data){
            this.contactUserInfo = data
        }
    },
  };
  </script>
  <style scoped>
  .tab-box {
    text-align: left;
    padding: 15px 15px;
    width: 100%;
  }
  
  .tab-box-title {
    font-size: 15px;
    font-weight: 900;
  }

  .form-item{
    width: 200px;
  }

  .form-item2 {
    width: 180px;
  }

  </style>
  