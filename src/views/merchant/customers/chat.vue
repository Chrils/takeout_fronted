<template>
  <div>
    <!-- 面包屑导航区域 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <router-link to="/welcome">首页</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <router-link to="/merchant/customers/follow">我的粉丝</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>聊天室</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 聊天室 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="chat-content">
            <div class="chat-content-title">聊天室</div>
            <div class="chat-content-list">
              <div class="chat-content-item">
                <div class="chat-content-item-avatar">
                  <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="">
                </div>
                <div class="chat-content-item-content">
                  <div class="chat-content-item-content-name">猫猫</div>
                  <div class="chat-content-item-content-time">2019-01-01</div>
                  <div class="chat-content-item-content-text">
                    <p>你好，我是猫猫，很高兴认识你！</p>
                  </div>
                </div>
              </div>
              <div class="chat-content-item">
                <div class="chat-content-item-avatar">
                  <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="">
                </div>
                <div class="chat-content-item-content">
                  <div class="chat-content-item-content-name">猫猫</div>
                  <div class="chat-content-item-content-time">2019-01-01</div>
                  <div class="chat-content-item-content-text">
                    <p>你好，我是猫猫，很高兴认识你！</p>
                  </div>
                </div>
              </div>
              <div class="chat-content-item">
                <div class="chat-content-item-avatar">
                  <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="">
                </div>
                <div class="chat-content-item-content">
                  <div class="chat-content-item-content-name">猫猫</div>
                  <div class="chat-content-item-content-time">2019-01-01</div>
                  <div class="chat-content-item-content-text">
                    <p>你好，我是猫猫，很高兴认识你！</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="chat-content-input">
            <el-input type="textarea" placeholder="请输入消息" v-model="message"></el-input>
            <el-button type="primary" @click="sendMessage">发送</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "chat",
  data() {
    return {
      message: ""
    };
  },
}
</script>

<style scoped lang="less">
.chat-content {
  padding: 20px;
}
.chat-content-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}
.chat-content-list {
  margin-bottom: 20px;
  height: 350px;
}
.chat-content-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.chat-content-item-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;
}
.chat-content-item-content {
  display: flex;
  flex-direction: column;
}
.chat-content-item-content-name {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
}
.chat-content-item-content-time {
  font-size: 12px;
  color: #999;
}
.chat-content-item-content-text {
  white-space: pre-wrap;
  word-break: break-all;
  margin-bottom: 20px;
}
.chat-content-input {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
</style>