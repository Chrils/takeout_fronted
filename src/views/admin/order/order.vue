<template>
  <div>
    <!-- 面包屑导航区域 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <router-link to="/welcome">首页</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form ref="form" :model="form" label-width="80px" size="small">
            <el-form-item label="订单编号">
              <el-input v-model="form.orderId" placeholder="请输入订单编号"></el-input>
            </el-form-item>
            <div class="multi-item">
              <el-form-item label="订单状态">
                <el-select v-model="form.orderStatus" placeholder="请选择订单状态">
                  <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in orderStatus" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="下单手机号" label-width="150px">
                <el-input v-model="form.phone" placeholder="输入下单客户手机号" style="width: 300px"></el-input>
              </el-form-item>
              <el-form-item label="商家名称" label-width="150px">
                <el-input v-model="form.shopName" placeholder="输入商家名称" style="width: 400px"></el-input>
              </el-form-item>
            </div>
            <el-form-item label="下单时间">
              <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择开始时间" style="width: 200px;"></el-date-picker>
              <span style="margin: 0 5px;">-</span>
              <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择结束时间" style="width: 200px;"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column label="订单编号">
          <template v-slot="scope">
            <router-link :to="'/order/detail/' + scope.row.orderId">{{ scope.row.orderId }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="订单状态">
          <template v-slot="scope">
            <el-tag type="info" v-if="scope.row.orderStatus === 'WAIT_PAY'">待付款</el-tag>
            <el-tag type="success" v-if="scope.row.orderStatus === 'PAID'">已付款</el-tag>
            <el-tag type="primary" v-if="scope.row.orderStatus === 'ACCEPT'">已接单</el-tag>
            <el-tag type="warning" v-if="scope.row.orderStatus === 'REFUNDED'">已退款</el-tag>
            <el-tag type="primary" v-if="scope.row.orderStatus === 'CANCELED'">已取消</el-tag>
            <el-tag type="danger" v-if="scope.row.orderStatus === 'COMPLETE'">已完成</el-tag>
            <el-tag type="danger" v-if="scope.row.orderStatus === 'CLOSED'">已关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间">
          <template v-slot="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="下单手机号">
          <template v-slot="scope">
            {{ scope.row.phone }}
          </template>
        </el-table-column>
        <el-table-column label="商家名称">
          <template v-slot="scope">
            <span @click="toShop(scope.row.shopId)">{{ scope.row.shopName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-more" size="small" @click="handleDetail(scope.row)">查看详情</el-button>
            <el-button type="success" icon="el-icon-location" size="small" @click="handleDelivery(scope.row)">流水线</el-button>
            <el-button type="danger" icon="el-icon-close" size="small" v-if="scope.row.orderStatus === 'WAIT_PAY'">取消</el-button>
            <el-button type="warning" icon="el-icon-right" size="small"
                       v-if="scope.row.orderStatus === 'PAID' || scope.row.orderStatus === 'ACCEPT'">退款</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
    <!-- 流水线信息对话框 -->
    <el-dialog title="流水线" :visible.sync="deliveryDialogVisible" width="30%">
      <!-- 使用timeline倒序显示物流信息 -->
      <el-timeline v-if="deliveryInfo.length > 0">
        <el-timeline-item v-for="item in deliveryInfo" :key="item.content" :timestamp="item.time">
          {{ item.content }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>

import moment from "moment";

export default {
  name: "order",
  data(){
    return{
      form: {
        orderId: '',
        orderStatus: '',
        startTime: '',
        endTime: '',
        customerPhone: '',
        shopName: ''
      },
      orderList: [],
      orderStatus: [
        {
          value: '',
          label: '全部',
        },
        {
          value: 'WAIT_PAY',
          label: '待付款',
        },
        {
          value: 'PAID',
          label: '已付款',
        },
        {
          value: 'ACCEPT',
          label: '已接单',
        },
        {
          value: 'COMPLETE',
          label: '已完成',
        },
        {
          value: 'CLOSED',
          label: '已关闭',
        },
        {
          value: 'CANCELED',
          label: '已取消',
        },
        {
          value: 'REFUNDED',
          label: '已退款',
        },

      ],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [5,10, 20, 30, 40],
      deliveryInfo: [],
      deliveryDialogVisible: false,
      cloneForm:{}
    }
  },
  methods:{
    search(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.cloneForm = JSON.parse(JSON.stringify(this.form));
          if (this.cloneForm.startTime){
            this.cloneForm.startTime = moment(this.form.startTime).format('YYYY-MM-DD hh:mm:ss')
          }else{
            delete this.cloneForm.startTime
          }
          if (this.cloneForm.endTime){
            this.cloneForm.endTime = moment(this.form.endTime).format('YYYY-MM-DD hh:mm:ss')
          }else{
            delete this.cloneForm.endTime
          }
          this.getOrderList();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    reset(){
      this.form = {
        orderId: '',
        orderStatus: '',
        startTime: '',
        endTime: '',
      }
      this.getOrderList();
    },
    async getOrderList(){
      const {data:res} = await this.$http.post(`/consumer/order/page/${this.currentPage}/${this.pageSize}`, this.cloneForm);
      if(res.meta.status !== "200") return this.$message.error(res.meta.msg);
      this.orderList = res.data.data;
      this.total = res.data.total;
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.getOrderList();
    },
    handleCurrentChange(val){
      this.currentPage = val;
      this.getOrderList();
    },
    handleDetail(row){
      this.$router.push(`/order/detail/${row.orderId}`);
    },
    async handleDelivery(row){
      const {data:res} = await this.$http.get(`/consumer/order/track/${row.orderId}`);
      if(res.meta.status !== "200") return this.$message.error(res.meta.msg);
      this.deliveryInfo = res.data.data;
      this.deliveryDialogVisible = true;
    },
    toShop(id){
      this.$router.push(`/shop/detail/${id}`);
    }
  },
  created() {
    this.getOrderList();
  },
  computed: {
  }
}
</script>

<style scoped>
.multi-item{
  display: flex;
  justify-content: left;
}

</style>