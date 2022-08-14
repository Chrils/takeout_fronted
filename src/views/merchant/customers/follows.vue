<template>
<div>
  <!-- 面包屑导航区域 -->
  <div class="breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>用户</el-breadcrumb-item>
      <el-breadcrumb-item>客户管理</el-breadcrumb-item>
      <el-breadcrumb-item>我的粉丝</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

  <el-card>
    <div class="follow-container">
      <div class="follow-item">
        <div class="follow-item-avatar" @click="toChat">
          <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="">
        </div>
        <div class="follow-item-info">
          <div class="follow-item-username">张三</div>
          <div class="follow-item-phone">13000000000</div>
        </div>
      </div>
      <div class="follow-item">
        <div class="follow-item-avatar">
          <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="">
        </div>
        <div class="follow-item-info">
          <div class="follow-item-username">张三</div>
          <div class="follow-item-phone">13000000000</div>
        </div>
      </div>
      <div class="follow-item">
        <div class="follow-item-avatar">
          <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="">
        </div>
        <div class="follow-item-info">
          <div class="follow-item-username">张三</div>
          <div class="follow-item-phone">13000000000</div>
        </div>
      </div>
      <div class="follow-item">
        <div class="follow-item-avatar">
          <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="">
        </div>
        <div class="follow-item-info">
          <div class="follow-item-username">张三</div>
          <div class="follow-item-phone">13000000000</div>
        </div>
      </div>
      <div class="follow-item">
        <div class="follow-item-avatar">
          <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="">
        </div>
        <div class="follow-item-info">
          <div class="follow-item-username">张三</div>
          <div class="follow-item-phone">13000000000</div>
        </div>
      </div>
      <div class="follow-item">
        <div class="follow-item-avatar">
          <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="">
        </div>
        <div class="follow-item-info">
          <div class="follow-item-username">张三</div>
          <div class="follow-item-phone">13000000000</div>
        </div>
      </div>
    </div>
  </el-card>

</div>
</template>

<script>
export default {
  name: "follows",
  data(){
    return{

    }
  },
  methods: {
    toChat(){
      this.$router.push("/merchant/customers/chat");
    }
  }
}
</script>

<style scoped lang="less">
.follow-container{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  >.follow-item{
    width: 50%;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    >.follow-item-avatar{
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      >img{
        width: 100%;
        height: 100%;
      }
    }
    >.follow-item-info{
      flex: 1;
      margin-left: 20px;
      >.follow-item-username{
        font-size: 16px;
        color: #333;
        margin-bottom: 5px;
      }
    }
  }
}
</style>