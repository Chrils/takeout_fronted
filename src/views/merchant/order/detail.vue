<template>
  <div class="order-detail">
    <!-- 面包屑导航区域 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <router-link to="/welcome">首页</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item to="/order/list">订单列表</el-breadcrumb-item>
        <el-breadcrumb-item>订单详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 订单详情 -->
    <el-card>
      <el-descriptions class="order-detail-info" :column="2" :data="order">
        <el-descriptions-item label="订单编号" >{{order.orderId}}</el-descriptions-item>
        <el-descriptions-item label="订单状态" >{{orderStatusName}}</el-descriptions-item>
        <el-descriptions-item label="商家名称" > <el-link type="primary" @click="toShop(1)">{{order.shopName}}</el-link> </el-descriptions-item>
        <el-descriptions-item label="下单时间" >{{order.createTime}}</el-descriptions-item>
        <el-descriptions-item label="订单备注" >{{order.remark === '' ? '无' : order.remark}}</el-descriptions-item>
        <el-descriptions-item label="收货人" >{{order.rcName}}</el-descriptions-item>
        <el-descriptions-item label="收货地址" >{{order.address}}</el-descriptions-item>
        <el-descriptions-item label="联系电话" >{{order.phone}}</el-descriptions-item>
        <el-descriptions-item label="订单金额" >{{order.total}}</el-descriptions-item>
        <el-descriptions-item label="折扣信息" >{{order.payItems}}</el-descriptions-item>
        <el-descriptions-item label="应付金额" >{{order.pay}}</el-descriptions-item>
        <el-descriptions-item label="实付金额" >{{order.pay}}</el-descriptions-item>
        <el-descriptions-item label="商品信息" >
          <el-table :data="order.orderItems" style="width: 100%" border stripe>
            <el-table-column label="商品名称" width="180">
              <template v-slot="scope">
                {{scope.row.goods.goodsName}}
              </template>
            </el-table-column>
            <el-table-column label="商品图片" prop="goodsPic" width="180">
              <template v-slot="scope">
                <img :src="scope.row.goods.goodsPic" width="100" height="100" alt="">
              </template>
            </el-table-column>
            <el-table-column label="商品价格" width="180">
              <template v-slot="scope">
                {{scope.row.goods.goodsPrice}}
              </template>
            </el-table-column>
            <el-table-column label="商品数量" prop="count" width="180"></el-table-column>
            <el-table-column label="商品总价" width="180" prop="total">
            </el-table-column>
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
      <div class="right">
        <!--打印小票按钮-->
        <el-button type="primary" icon="el-icon-download" @click="printOrder">打印小票</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "detail",
  data() {
    return {
      order: {
        orderId: "",
        createTime: "",
        total: "",
        orderStatus: "",
        orderStatusName: "",
        remark: "",
        orderItemList: [],
        shopName:'',
        rcName:'',
        address:'',
        phone:'',
        payItems:[],
        pay:0,
        orderItems:[],

      }
    };
  },
  methods: {
    async getOrderDetail() {
      let order_no = this.$route.params.order_no;
      const {data:res} = await this.$http.get(`/consumer/order/detail/${order_no}`);
      if(res.meta.status !== '200') return this.$message.error(res.meta.msg);
      this.order = res.data.data;
    },
    toShop(id){
      this.$router.push(`/shop/detail`);
    }
  },
  created() {
    this.getOrderDetail();
  },
  computed:{
    orderStatusName(){
      switch(this.order.orderStatus){
        case 'WAIT_PAY':
          return '待付款';
        case 'PAID':
          return '已付款';
        case 'ACCEPT':
          return '已接单';
        case 'CANCEL':
          return '已取消';
        case 'COMPLETE':
          return '已完成';
        case 'REFUNDED':
          return '已退款';
        case 'CLOSED':
          return '已关闭';
        default:
          return '未知状态';
      }
    }
  }
}
</script>

<style scoped>

</style>