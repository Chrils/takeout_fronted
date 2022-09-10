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
        <div class="block">
        <el-date-picker
            v-model="value1"
            type="date"
            :editable="false"
            @change="changeDate($event)"
            placeholder="选择要查询数据的日期">
        </el-date-picker>
  </div>
        <el-col :span="8">
          <!-- 柱状图 -->
          <div class="chart-content" :style="{width: '500px', height: '500px'}"></div>
        </el-col>
        <el-col :span="16">
          <!-- 饼状图 -->
          <div class="chart-content" :style="{width: '700px', height: '500px'}"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <!-- 折线图 -->
          <div class="chart-content" :style="{width: '1200px', height: '300px'}"></div>
        </el-col>
          <div class="blocks" >
            <el-date-picker
                v-model="value3"
                type="year"
                :editable="false"
                @change="changeYear($event)"
                placeholder="选择要查询数据的年份">
            </el-date-picker>
        </div>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "Stat",
  data(){
    return{
      orderCount:0,//今日成交订单量
      orderAmount:0,//今日成交金额
      totalOrderCount:0,//总成交订单量
      totalOrderAmount:0,//总成交金额
      provinceChart:[],
      typeName:[],
      amount:[],
      amountByMonth:[],
      value1: new Date(),
      value3: new Date(),
    }
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    this.getTypeName();
    this.getTypeAmount().then(this.getProvinceChart1)
    this.getProvinceChart();
    this.getAmount();
    this.getAmount().then(this.getProvinceChart3)
  },
  created() {
    this.getAllOrder();
    this.getAllPrice();
    this.getAllPriceByTime();
    this.getAllOrderByTime();
  },
  methods:{
    //顶部四条数据
    async getAllOrderByTime(){
      const {data: res} = await this.$http.get("Chart/getAllOrderByTime");
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      this.orderCount=res.data.data;
    },
    async getAllPriceByTime(){
      const {data: res} = await this.$http.get("Chart/getAllPriceByTime");
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      this.orderAmount=res.data.data;
    },
    async getAllOrder(){
      const {data: res} = await this.$http.get("Chart/getAllOrder");
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      this.totalOrderCount=res.data.data;
    },
    async getAllPrice(){
      const {data: res} = await this.$http.get("Chart/getAllPrice");
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      this.totalOrderAmount=res.data.data;
    },

    //图1.各类型店铺当天销售额(默认)
    async getTypeName(){
      const {data: res} = await this.$http.get("Chart/getTypeName");
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      this.typeName=res.data.data;
    },
    async getTypeAmount(){
      function checkTime(i){
        if(i<10){
          i='0'+i
        }
        return i
      }
      var date;
      date= new Date(this.value1)
      var dateTime = date.getFullYear()+'-'+checkTime(date.getMonth()+1)+'-'+checkTime(date.getDate());

      const {data: res} = await this.$http.get("Chart/getTypeAmount?time="+dateTime.toString());
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      this.amount=res.data.data;
    },
    async getProvinceChart1(){
      const myChart = echarts.init(document.getElementsByClassName('chart-content')[0]);
      // 绘制图表
      myChart.setOption({
        title: {
          text: '销售额统计',
        },
        tooltip: {},
        legend: {
          data:['销量']
        },
        xAxis: {
          data: this.typeName,
          type: "category",
          axisLabel: {
            //x轴文字的配置
            show: true,
            interval: 0,//使x轴文字显示全
          }
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: this.amount
        }]
      });
    },
    //图1.选择日期，查询数据
   async changeDate(val){
      function checkTime(i){
        if(i<10){
          i='0'+i
        }
        return i
      }
      var date;
      date= new Date(this.value1)
      var dateTime = date.getFullYear()+'-'+checkTime(date.getMonth()+1)+'-'+checkTime(date.getDate());
      const {data: res} =await this.$http.get("Chart/getTypeAmount?time="+dateTime.toString());
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      this.amount=res.data.data;
      this.getProvinceChart1();
    },
    //图2.饼图（各省商家数量）
    async getProvinceChart() {
      const {data: res} = await this.$http.get("Chart/getProvinceChart");
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      res.data.data.forEach((item)=>{
        this.provinceChart.push({
          name:item.province,
          value:item.number
        })
      })
      const myChart2 = echarts.init(document.getElementsByClassName('chart-content')[1]);
      // 绘制图表
      myChart2.setOption({
        title: {
          text: '销售地区来源',
        },
        series: [
          {
            type: "pie", // type设置为饼图
            data: this.provinceChart,
            label: {
              normal: {
                show: true,
                position: "outside",
                formatter: "{b}:{d}%"
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    //图3 折线图（默认）
    async getAmount(val){
      var date;
      date= new Date(this.value3)
      var datetime = date.getFullYear();
      const {data: res} = await this.$http.get("Chart/getTurnoverByMonth?time="+datetime.toString());
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
     this.amountByMonth=res.data.data;
    },
    async getProvinceChart3(){
      // 绘制图表
      const myChart3 = echarts.init(document.getElementsByClassName('chart-content')[2]);
      myChart3.setOption({
        title: {
          text: '月销售额趋势',
        },
        xAxis: {
          type: 'category',
          data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.amountByMonth,
            type: 'line'
          }
        ]
      });
    },
    //图3.选择年份，查询数据
    async changeYear(val){
      var date;
      date= new Date(this.value3)
      var datetime = date.getFullYear();
      const {data: res} = await this.$http.get("Chart/getTurnoverByMonth?time="+datetime.toString());
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      this.amountByMonth=res.data.data;
      this.getProvinceChart3();
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
.block{
  padding-left: 190px;
}
.blocks{
  padding-left: 490px;
}
</style>