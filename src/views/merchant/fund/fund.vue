<template>
  <div>
    <!-- 面包屑导航区域 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>资金管理</el-breadcrumb-item>
        <el-breadcrumb-item>资金明细</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-card>
      <div class="fund-top">
        <div class="money">
          <div class="money-title">账户余额</div>
          <div class="money-amount">￥{{ fund.amount }}</div>
        </div>
        <div class="money-action">
          <el-button type="primary" @click="showDrawer">提现</el-button>
        </div>
      </div>
      <div class="fund-query">
        <div>
          <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择开始时间"
                          style="width: 200px;"></el-date-picker>
          <span style="margin: 0 5px;">-</span>
          <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择结束时间"
                          style="width: 200px;"></el-date-picker>
        </div>
        <div>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <template>
            <download-excel
                class="export-excel-wrapper"
                :data="CheckInDetailsForm"
                :fields="json_fields"
                :header="checkInTitle"
                name="支入资金明细.xls"
                :before-generate="handleIn"
            >
              <el-button type="warning">导出支入情况</el-button>
            </download-excel>
          </template>
          <template>
            <download-excel
                class="export-excel-wrapper"
                :data="CheckOutDetailsForm"
                :fields="json_fields"
                :header="checkOutTitle"
                name="支出资金明细.xls"
                :before-generate="handleOut"
            >
              <el-button type="warning">导出支出情况</el-button>
            </download-excel>
          </template>
        </div>
      </div>
      <div class="fund-details">
        <div class="fund-detail">
          <div class="fund-detail-title">支入记录</div>
          <div class="fund-detail-list">
            <div class="fund-detail-item" v-for="item in checkInList">
              <div class="fund-item-title">{{ item.title }}</div>
              <div class="fund-item-time">{{ item.time }}</div>
              <div class="fund-item-amount">
                <span class="fund-item-amount-income">+{{ item.amount }}</span>
              </div>
            </div>
          </div>
          <div class="fund-detail-pager">
            <!-- 分页视图 -->
            <el-pagination
                @current-change="handleCurrentChangeIn"
                :current-page="checkInForm.pageNo"
                :page-size="checkInForm.pageSize"
                layout="prev,pager,next"
                :total="checkInForm.total">
            </el-pagination>
          </div>
        </div>
        <div class="fund-detail">
          <div class="fund-detail-title">支出记录</div>
          <div class="fund-detail-list">
            <div class="fund-detail-item" v-for="item in checkOutList">
              <div class="fund-item-title">{{ item.title }}</div>
              <div class="fund-item-time">{{ item.time }}</div>
              <div class="fund-item-amount">
                <span class="fund-item-amount-expend">-{{ item.amount }}</span>
              </div>
            </div>
          </div>
          <div class="fund-detail-pager">
            <!-- 分页视图 -->
            <el-pagination
                @current-change="handleCurrentChangeOut"
                :current-page="checkOutForm.pageNo"
                :page-size="checkOutForm.pageSize"
                layout="prev,pager,next"
                :total="checkOutForm.total">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-card>

  </div>
</template>

<script>
export default {
  name: "fund",
  data() {
    return {
      checkInForm: {
        pageNo: 1,
        pageSize: 8,
        total: 0
      },
      checkOutForm: {
        pageNo: 1,
        pageSize: 8,
        total: 0
      },
      checkInList: [],
      checkOutList: [],
      fund: {
        amount: 999.89,
      },
      form: {
        startTime: '',
        endTime: '',
        shopId: localStorage.getItem('shopId')
      },
      json_fields:{
        "日期":"time",
        "标题":"title",
        "金额":"amount"
      },
      CheckInDetailsForm:[],
      CheckOutDetailsForm:[]
    }
  },
  methods: {
    handleQuery() {
      this.getCheckInList();
      this.getCheckOutList();
    },
    async getCheckInList() {
      let str = "?r=1";
      if (this.form.startTime) {
        str += `&startTime=${this.form.startTime.toLocaleString()}`
      }
      if (this.form.endTime) {
        str += `&endTime=${this.form.endTime.toLocaleString()}`
      }
      const {data: res} = await this.$http.get(`/consumer/user/fund-detail/CHECK_IN/${this.form.shopId}/page/${this.checkInForm.pageNo}/${this.checkInForm.pageSize}${str}`)
      if (res.meta.status !== "200") return this.$message.error(res.meta.msg)
      this.checkInList = res.data.data.records;
      this.checkInForm.total = res.data.data.total
    },
    async getCheckOutList() {
      let str = "?r=1";
      if (this.form.startTime) {
        str += `&startTime=${this.form.startTime.toLocaleString()}`
      }
      if (this.form.endTime) {
        str += `&endTime=${this.form.endTime.toLocaleString()}`
      }
      const {data: res} = await this.$http.get(`/consumer/user/fund-detail/CHECK_OUT/${this.form.shopId}/page/${this.checkInForm.pageNo}/${this.checkInForm.pageSize}${str}`)
      if (res.meta.status !== "200") return this.$message.error(res.meta.msg)
      this.checkOutList = res.data.data.records;
      this.checkOutForm.total = res.data.data.total
    },
    async handleOut() {
      let str = "?r=1";
      let val = "CHECK_OUT"
      if (this.form.startTime) {
        str += `&startTime=${this.form.startTime.toLocaleString()}`
      }
      if (this.form.endTime) {
        str += `&endTime=${this.form.endTime.toLocaleString()}`
      }
      const {data: res} = await this.$http.get(`/consumer/user/fund-detail/${val}/${this.form.shopId}/without-page${str}`)
      if (res.meta.status !== "200") return this.$message.error(res.meta.msg)
      this.CheckOutDetailsForm = res.data.data;
    },
    async handleIn(){
      let str = "?r=1";
      let val = "CHECK_IN"
      if (this.form.startTime) {
        str += `&startTime=${this.form.startTime.toLocaleString()}`
      }
      if (this.form.endTime) {
        str += `&endTime=${this.form.endTime.toLocaleString()}`
      }
      const {data: res} = await this.$http.get(`/consumer/user/fund-detail/${val}/${this.form.shopId}/without-page${str}`)
      if (res.meta.status !== "200") return this.$message.error(res.meta.msg)
      this.CheckInDetailsForm = res.data.data;
    },
    async handleCurrentChangeIn(val) {
      this.checkInForm.pageNo = val;
      await this.getCheckInList()
    },
    async handleCurrentChangeOut(val) {
      this.checkOutForm.pageNo = val;
      await this.getCheckOutList()
    },
    showDrawer() {
    },
    async getBalance(){
      const {data:res} = await this.$http.get("user/selectMoneyByUserId?userId="+JSON.parse(localStorage.getItem('user')).userId)
      if (res.meta.status !== '200') return this.$message.error(res.meta.msg)
      this.fund.amount = res.data.data.toFixed(2);
    }
  },
  computed:{
    checkInTitle(){
      if (this.form.startTime && this.form.endTime){
        return 'O2O平台资金支入('+this.form.startTime.toLocaleString()+'-'+this.form.endTime.toLocaleString()+')';
      }else{
        return 'O2O平台资金支入（近7天）'
      }
    },
    checkOutTitle(){
      if (this.form.startTime && this.form.endTime){
        return 'O2O平台资金支出('+this.form.startTime.toLocaleString()+'-'+this.form.endTime.toLocaleString()+')';
      }else{
        return 'O2O平台资金支出（近7天）'
      }
    }
  },
  created() {
    this.getCheckInList()
    this.getCheckOutList()
    this.getBalance()
  }
}
</script>

<style scoped lang="less">
.fund-top {
  display: flex;
  justify-content: space-between;
  align-items: center;

  > .money {
    display: flex;
    align-items: center;

    > .money-title {
      font-size: 16px;
      font-weight: bold;
      margin-right: 10px;
    }

    > .money-amount {
      font-size: 20px;
      font-weight: bold;
      color: #f50;
    }
  }
}

.fund-details {
  display: flex;
  justify-content: space-between;

  > .fund-detail {
    width: 50%;

    > .fund-detail-title {
      margin-top: 20px;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    > .fund-detail-list {
      > .fund-detail-item {
        display: flex;
        width: 100%;
        margin: 16px 0;
        background-color: #fff;

        > .fund-item-title {
          font-size: 14px;
          color: #333;
          width: 130px;
        }

        > .fund-item-time {
          font-size: 12px;
          color: #999;
          width: 230px;
        }

        > .fund-item-amount {
          display: flex;
          align-items: center;

          > .fund-item-amount-income {
            font-size: 14px;
            color: dodgerblue;
            margin-right: 10px;
          }

          > .fund-item-amount-expend {
            font-size: 14px;
            color: #f50;
          }
        }
      }
    }

    > .fund-detail-pager {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 8px;
    }
  }
}

.fund-query {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  >div{
    display: flex;
    align-items: center;
    justify-content: right;
    >*{
      margin: 0 5px;
    }
  }
}
</style>