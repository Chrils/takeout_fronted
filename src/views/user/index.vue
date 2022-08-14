<template>
  <div>
    <!-- 面包屑导航区域 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>用户</el-breadcrumb-item>
        <el-breadcrumb-item>首页</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card>
      <el-row class="pic-link-center">
        <!-- 申请注册店铺图片链接 -->
        <img src="@/assets/img/merchant.jpg" alt="header" >
        <div class="apply-text-container">
          <div class="apply-text">
            <p>帮助外卖商家在站外推广、站外活动运营，提升整体流量和订单，打造开放平台商家站外良性生态</p>
          </div>
          <div>
            <el-button type="primary" icon="el-icon-right" @click="applyMerchant" style="width: 300px;margin-left: 12px;">申请注册店铺</el-button>
          </div>
        </div>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
    }
  },
  methods:{
    applyMerchant(){
      this.$router.push("/client/apply");
    }
  },
  created() {
  }
}
</script>

<style scoped lang="less">
.pic-link-center{
  display: flex;
  justify-content: center;
  align-items: center;
}
.apply-text-container{
  margin-left: 20px;
  width: 430px;
  >.apply-text{
    padding: 20px;
    >p{
      font-size: 18px;
      color: #333;
      line-height: 30px;
    }
  }
}
</style>