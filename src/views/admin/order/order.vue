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
              <el-input v-model="form.orderNo" placeholder="请输入订单编号"></el-input>
            </el-form-item>
            <div class="multi-item">
              <el-form-item label="订单状态">
                <el-select v-model="form.orderStatus" placeholder="请选择订单状态">
                  <el-option v-for="item in orderStatus" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="下单手机号" label-width="150px">
                <el-input v-model="form.customerPhone" placeholder="输入下单客户手机号" style="width: 300px"></el-input>
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
            <router-link :to="'/order/detail/' + scope.row.orderNo">{{ scope.row.orderNo }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="订单状态">
          <template v-slot="scope">
            <el-tag type="info" v-if="scope.row.orderStatus === 0">待付款</el-tag>
            <el-tag type="success" v-if="scope.row.orderStatus === 1">已付款</el-tag>
            <el-tag type="primary" v-if="scope.row.orderStatus === 2">已接单</el-tag>
            <el-tag type="warning" v-if="scope.row.orderStatus === 3">配送中</el-tag>
            <el-tag type="success" v-if="scope.row.orderStatus === 4">已送达</el-tag>
            <el-tag type="primary" v-if="scope.row.orderStatus === 5">已取消</el-tag>
            <el-tag type="danger" v-if="scope.row.orderStatus === 6">已退款</el-tag>
            <el-tag type="danger" v-if="scope.row.orderStatus === 7">退款异常</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间">
          <template v-slot="scope">
            {{ scope.row.orderCreateTime }}
          </template>
        </el-table-column>
        <el-table-column label="下单手机号">
          <template v-slot="scope">
            {{ '13000000000' }}
          </template>
        </el-table-column>
        <el-table-column label="商家名称">
          <template v-slot="scope">
            <span @click="toShop(1)">{{ '花雕醉鸡' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-more" size="small" @click="handleDetail(scope.row)">查看详情</el-button>
            <el-button type="success" icon="el-icon-location" size="small" @click="handleDelivery(scope.row)">流水线</el-button>
            <el-button type="danger" icon="el-icon-close" size="small" v-if="scope.row.orderStatus === 0">取消</el-button>
            <el-button type="warning" icon="el-icon-right" size="small"
                       v-if="scope.row.orderStatus === 1 || scope.row.orderStatus === 2 || scope.row.orderStatus === 3 || scope.row.orderStatus === 4">退款</el-button>
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
        <el-timeline-item v-for="item in deliveryInfo" :key="item.logisticsTime" :timestamp="item.logisticsTime">
          {{ item.logisticsDesc }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "order",
  data(){
    return{
      form: {
        page: 1,
        size: 5,
        orderNo: '',
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
          value: '0',
          label: '待付款',
        },
        {
          value: '1',
          label: '已付款',
        },
        {
          value: '2',
          label: '已接单',
        },
        {
          value: '3',
          label: '配送中',
        },
        {
          value: '4',
          label: '已送达',
        },
        {
          value: '5',
          label: '已取消',
        },
        {
          value: '6',
          label: '已退款',
        },
        {
          value: '7',
          label: '退款异常',
        }

      ],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [5,10, 20, 30, 40],
      deliveryInfo: [],
      deliveryDialogVisible: false,
    }
  },
  methods:{
    search(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.getOrderList();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    reset(){
      this.form = {
        orderNo: '',
        orderStatus: '',
        startTime: '',
        endTime: '',
      }
      this.getOrderList();
    },
    async getOrderList(){
      this.form.page = this.currentPage;
      this.form.size = this.pageSize;
      const {data:res} = await this.$http.get('/admin/order/list', {params: this.form});
      if(res.meta.status !== "OK") return this.$message.error(res.meta.msg);
      this.orderList = res.data.page.records;
      this.total = res.data.page.total;
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
      this.$router.push(`/order/detail/${row.orderNo}`);
    },
    async handleDelivery(row){
      const {data:res} = await this.$http.get(`/admin/order/detail/${row.orderId}/logistics`);
      if(res.meta.status !== "OK") return this.$message.error(res.meta.msg);
      this.deliveryInfo = res.data.list;
      this.deliveryDialogVisible = true;
    },
    toShop(id){
      this.$router.push(`/shop/detail`);
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