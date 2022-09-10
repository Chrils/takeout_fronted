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
              <div class="chat-content-item" v-for="(item,index) in newsList" :key="index" v-if="item.type==0">
                <div class="chat-content-item-avatar">
                  <img src="https://ts3.cn.mm.bing.net/th?id=OIP-C.jm-rxeiiZoHo4V1yVa6PMgHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.25&pid=3.1&rm=2" alt="">
                </div>
                <div class="chat-content-item-content">
                  <div class="chat-content-item-content-name">客户</div>
                  <div class="chat-content-item-content-time">{{ item.createTime }}</div>
                  <div class="chat-content-item-content-text">
                    <p>{{ item.content }}</p>
                  </div>
                </div>
              </div>

              <div class="chat-content-item c-right" v-else>
                <div class="chat-content-item-content" style="margin-right: 10px;">
                  <div class="chat-content-item-content-name" style="margin-right: 5px;">您</div>
                  <div class="chat-content-item-content-time" style="margin-right: 5px;">{{ item.createTime }}</div>
                  <div class="chat-content-item-content-text">
                    <p>{{ item.content }}</p>
                  </div>
                </div>
                <div class="chat-content-item-avatar">
                  <img src="@/assets/img/customer.png" alt="">
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
            <el-button type="primary" @click="send">发送</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: "chat",
  data() {
    return {
      message: "",
      path: "",
      socket: "",
      sendId: JSON.parse(localStorage.getItem('user')).userId,
      receiveId: this.$route.params.userId,
      roomId:localStorage.getItem('shopId'),
      newsList: [],
    };
  },
  mounted() {
    // 初始化
    this.init()
  },
  methods: {
    init: function () {
      if (typeof (WebSocket) === "undefined") {
        alert("您的浏览器不支持socket")
      } else {
        // TODO 实例化socket
        this.socket = new WebSocket(`ws://192.168.2.112:8082/webSocketOneToOne/${this.sendId},${this.roomId}`)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.getMessage
      }
    },
    open: function () {
      console.log("socket连接成功")
    },
    error: function () {
      console.log("连接错误")
    },
    getMessage: function (msg) {
      let data = JSON.parse(msg.data)
      data.createTime = moment(data.createTime).format('YYYY-MM-DD hh:mm:ss')
      console.log("time", data.createTime)
      let list = this.newsList
      list.push(data)
      this.newsList = list
    },
    send: function () {
      //获取发送内容
      let msg = this.message
      //清空文本区域
      this.message = ""
      let json = {
        'message': msg,
        'receiveId': this.receiveId + '',
        'roomId': this.roomId,
        'type': '1'
      }
      let list = this.newsList
      let temp = {
        'content': this.message,
        'createTime': new Date(),
        'type': 1
      }
      this.socket.send(JSON.stringify(json))

    },
    close: function () {
      console.log("socket已经关闭")
    }
  },
  destroyed() {
    // 销毁监听
    this.socket.onclose = this.close
  }
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
  overflow-y: scroll;
}

.chat-content-list::-webkit-scrollbar {
  display: none;
}

.chat-content-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.c-right {
  justify-content: right;
  text-align: right;
}

.text-class {

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