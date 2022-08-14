<template>
<div>
  <!-- 面包屑导航区域 -->
  <div class="breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        <router-link to="/welcome">首页</router-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item>店铺信息</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

  <el-card>
    <div id="shop-container">
      <div class="shop-pic">
        <!-- 店铺图片 -->
        <img src="@/assets/img/pre/shop.jpg" alt="">
      </div>
      <div class="shop-desc">
        <el-row :gutter="20">
          <el-col :span="6">店铺名称</el-col>
          <el-col :span="14">
            <h3>毛妈排骨连锅庄</h3>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">店铺分类</el-col>
          <el-col :span="14">美食-快餐-汉堡披萨</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">店铺地址</el-col>
          <el-col :span="14">湖南省岳阳市岳阳楼区奇家岭街道</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">店铺负责人</el-col>
          <el-col :span="14">张三</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">联系电话</el-col>
          <el-col :span="14">10088208820</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">营业时间</el-col>
          <el-col :span="14">11:00-13:00;16:30-18:00</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">营业状态</el-col>
          <el-col :span="14">
            <el-tag type="success">营业中</el-tag>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 商家评分区域 -->
    <div>
      <el-row :gutter="10">
        <el-col :span="7">
          好评度: <span class="percentage">85%</span>
        </el-col>
        <el-col :span="7">
          <div class="score-item">
            <span>服务态度: </span>
            <el-rate
                v-model="value"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}">
            </el-rate>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="score-item">
            <span>菜品口味: </span>
            <el-rate
                v-model="value"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}">
            </el-rate>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="switch-toggle">
      <el-switch
          v-model="autoUp"
          active-text="开启自动营业"
          on-value="1"
          off-value="0">
      </el-switch>
    </div>

    <div class="switch-toggle">
      <el-switch
          v-model="autoReceiveOrder"
          active-text="开启自动接单"
          on-value="1"
          off-value="0">
      </el-switch>
    </div>

    <!-- 折叠项 -->
    <el-collapse v-model="activeNames">
      <el-collapse-item title="商家公告" name="1">
        <p>毛妈排骨连锅庄是一家经营毛妈排骨的餐馆，毛妈排骨是毛妈排骨连锅庄的主营产品。</p>
      </el-collapse-item>
    </el-collapse>

    <!-- 店铺操作 -->
    <div class="shop-operate">
      <el-button type="primary" @click="handleEdit">编辑信息</el-button>
      <el-button type="warning" @click="handleDown">打烊</el-button>
    </div>

  </el-card>
</div>
</template>

<script>
export default {
  name: "profile",
  data(){
    return {
      value: 4.5,
      activeNames: '',
      autoUp: 1,
      autoReceiveOrder: 1
    }
  },
  methods: {
    handleEdit(){
      this.$router.push("/merchant/profile/edit");
    },
    handleDown(){
      this.$confirm('确定要打烊吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '打烊成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消打烊'
        });
      });
    }
  }
}
</script>

<style scoped lang="less">
#shop-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

> .shop-desc {
  width: 60%;
  margin-left: 20px;
  height: 100%;
  line-height: 40px;
}
}

.percentage {
  font-size: 20px;
  color: #ff9900;
}

.score-item {
  display: flex;
  justify-content: left;
  align-items: center;
  margin-bottom: 10px;
}

.multi-right{
  text-align: right;
}

.shop-operate{
  display: flex;
  justify-content: right;
  margin-bottom: 20px;
}

.switch-toggle{
  display: flex;
  justify-content: left;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>