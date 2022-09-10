<template>
  <div>
    <!-- 面包屑导航区域 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <router-link to="/welcome">首页</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据监控</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 数据监控 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="data-sum-item">
            <div class="data-sum-item-title">今日成交订单量</div>
            <div class="data-sum-item-value">{{ orderCount }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="data-sum-item">
            <div class="data-sum-item-title">今日成交金额</div>
            <div class="data-sum-item-value">{{ orderAmount }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="data-sum-item">
            <div class="data-sum-item-title">总成交订单量</div>
            <div class="data-sum-item-value">{{ totalOrderCount }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="data-sum-item">
            <div class="data-sum-item-title">总成交金额</div>
            <div class="data-sum-item-value">{{ totalOrderAmount }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="20">
          <div class="blocks" id="blocks1">
            <el-date-picker
                v-model="value1"
                type="year"
                :editable="false"
                @change="changeYear1($event)"
                placeholder="选择要查询数据的年份">
            </el-date-picker>
          </div>
          <!-- 柱状图 -->
          <div class="chart-content" :style="{width: '1300px', height: '500px'}"></div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="10">
          <div class="blocks" id="blocks2">
            <el-date-picker
                v-model="value2"
                type="year"
                :editable="false"
                @change="changeYear2($event)"
                placeholder="选择要查询数据的年份">
            </el-date-picker>
          </div>
          <!-- 折线图 -->
          <div class="chart-content" :style="{width: '600px', height: '500px'}"></div>
        </el-col>
        <el-col :span="10">
          <div class="blocks" id="blocks3">
            <el-date-picker
                v-model="value3"
                type="year"
                :editable="false"
                @change="changeYear3($event)"
                placeholder="选择要查询数据的年份">
            </el-date-picker>
          </div>
          <!-- 折线图 -->
          <div class="chart-content" :style="{width: '600px', height: '500px'}"></div>

        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "data",
  data() {
    return {
      orderCount: 0,
      orderAmount: 0,
      totalOrderCount: 0,
      totalOrderAmount: 0,
      complaintNum:[],
      orderNum:[],
      turnoverNum:[],
      value1:'',
      value2:'',
      value3:'',
    }
  },
  mounted() {
    this.getComplaintNum();
    this.userGetOrderNum();
    this.userGetTurnover();
  },
  created() {
    this.getTopOne();
    this.getTopTwo();
    this.getTopThree();
    this.getTopFour();
  },
  methods: {
    async getTopOne() {
      const {data: res} = await this.$http.get("Chart/userGetOrderByDay?shopId="+localStorage.getItem('shopId'));
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      this.orderCount = res.data.data;
    },
    async getTopTwo() {
      const {data: res} = await this.$http.get("Chart/userGetPriceByDay?shopId="+localStorage.getItem('shopId'));
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      this.orderAmount = res.data.data;
    },
    async getTopThree() {
      const {data: res} = await this.$http.get("Chart/userGetOrder?shopId="+localStorage.getItem('shopId'));
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      this.totalOrderCount = res.data.data;
    },
    async getTopFour() {
      const {data: res} = await this.$http.get("Chart/userGetPrice?shopId="+localStorage.getItem('shopId'));
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      this.totalOrderAmount = res.data.data;
    },

    async getComplaintNum(){
      const {data: res} = await this.$http.get("Chart/getComplaintNum?shopId=1");
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      this.complaintNum = res.data.data;

      // 绘制图表
      const myChart = echarts.init(document.getElementsByClassName('chart-content')[0]);
      myChart.setOption({
        title: {
          text: '举报数量',
        },
        tooltip: {},
        legend: {
          data: ['条']
        },
        xAxis: {
          data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        },
        yAxis: {},
        series: [{
          name: '条',
          type: 'bar',
          data: this.complaintNum
        }]
      });
    },
    async changeYear1(val) {
      var date;
      date= new Date(this.value1)
      var dateTime = date.getFullYear();

      const {data: res} =await this.$http.get("Chart/getComplaintByYear?shopId=1&time="+dateTime.toString());
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      this.complaintNum = res.data.data;
      console.log(res.data.data);
      console.log(this.complaintNum);
      const myChart = echarts.init(document.getElementsByClassName('chart-content')[0]);
      myChart.setOption({
        title: {
          text: '举报数量',
        },
        tooltip: {},
        legend: {
          data: ['条']
        },
        xAxis: {
          data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        },
        yAxis: {},
        series: [{
          name: '条',
          type: 'bar',
          data: this.complaintNum
        }]
      });
    },

    async userGetOrderNum() {
      const {data: res} = await this.$http.get("Chart/userGetOrderNum?shopId="+localStorage.getItem('shopId'));
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      this.orderNum = res.data.data;
      const myChart1 = echarts.init(document.getElementsByClassName('chart-content')[1]);
      myChart1.setOption({
        title: {
          text: '月订单额',
        },
        xAxis: {
          type: 'category',
          data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        },
        yAxis: {
          minInterval:1,
          type: 'value'
        },
        series: [
          {
            data: this.orderNum,
            type: 'line'
          }
        ]
      });
    },
    async changeYear2(val) {
      var date;
      date= new Date(this.value2)
      var dateTime = date.getFullYear();

      const {data: res} =await this.$http.get("Chart/userGetOrderByYear?shopId=12&time="+dateTime.toString());
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      this.orderNum = res.data.data;
      const myChart1 = echarts.init(document.getElementsByClassName('chart-content')[1]);
      myChart1.setOption({
        title: {
          text: '月订单额',
        },
        xAxis: {
          type: 'category',
          data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        },
        yAxis: {
          minInterval:1,
          type: 'value'
        },
        series: [
          {
            data: this.orderNum,
            type: 'line'
          }
        ]
      });
    },

    async userGetTurnover(){
      const {data: res} = await this.$http.get("Chart/userGetTurnoverByMonth?shopId="+localStorage.getItem('shopId'));
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      this.turnoverNum = res.data.data;
      const myChart1 = echarts.init(document.getElementsByClassName('chart-content')[2]);
      myChart1.setOption({
        title: {
          text: '月流水量',
        },
        xAxis: {
          type: 'category',
          data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        },
        yAxis: {
          minInterval:1,
          type: 'value'
        },
        series: [
          {
            data: this.turnoverNum,
            type: 'line'
          }
        ]
      });
    },
    async changeYear3(val) {
      var date;
      date= new Date(this.value3)
      var dateTime = date.getFullYear();
      const {data: res} = await this.$http.get("Chart/userGetTurnoverByYear?shopId=12&time="+dateTime.toString());
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      this.turnoverNum = res.data.data;
      const myChart1 = echarts.init(document.getElementsByClassName('chart-content')[2]);
      myChart1.setOption({
        title: {
          text: '月流水量',
        },
        xAxis: {
          type: 'category',
          data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        },
        yAxis: {
          minInterval:1,
          type: 'value'
        },
        series: [
          {
            data: this.turnoverNum,
            type: 'line'
          }
        ]
      });
    },
  }
}
</script>

<style scoped lang="less">
.data-sum-item {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  height: 70px;
  border: 2px solid #dddddd;

  > .data-sum-item-value {
    font-size: 23px;
    color: #30ccc1;
    font-weight: bold;
    margin-left: 20px;
  }

}
#blocks1{
  margin-left: 530px;
  margin-bottom:20px;
}
#blocks2{
  margin-left: 200px;
}
#blocks3{
  margin-left: 200px;
}
</style>