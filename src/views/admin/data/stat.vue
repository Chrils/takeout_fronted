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
        <el-col :span="12">
          <!-- 折线图 -->
          <div class="chart-content" :style="{width: '600px', height: '300px'}"></div>
        </el-col>
        <el-col :span="12">
          <!-- 折线图 -->
          <div class="chart-content" :style="{width: '600px', height: '300px'}"></div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
const option = {
  title: {
    text: '销售地区来源',
  },
  series: [
    {
      type: "pie", // type设置为饼图
      data: [
        {
          value: 147,
          name: "江苏"
        },
        {
          value: 395,
          name: "浙江"
        },
        {
          value: 157,
          name: "山东"
        },
        {
          value: 149,
          name: "广东"
        },
        {
          value: 463,
          name: "湖南"
        },
        {
          value: 523,
          name: "湖北"
        }
      ],
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
};


export default {
  name: "Stat",
  data(){
    return{
      orderCount:999,
      orderAmount:999,
      totalOrderCount:999,
      totalOrderAmount:999,
    }
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
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
        data: ["米粉面馆","披萨汉堡","麻辣烫","烧烤串串","蒸菜","包子粥铺"]
      },
      yAxis: {},
      series: [{
        name: '销量/万',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    });
    const myChart2 = echarts.init(document.getElementsByClassName('chart-content')[1]);
    // 绘制图表
    myChart2.setOption(option);
    const myChart3 = echarts.init(document.getElementsByClassName('chart-content')[2]);
    // 绘制图表
    myChart3.setOption({
      title: {
        text: '日销售额趋势',
      },
      xAxis: {
        data: ['8-5', '8-6', '8-7', '8-8', '8-9']
      },
      yAxis: {},
      series: [
        {
          data: [10, 22, 28, 23, 19],
          type: 'line',
          label: {
            show: true,
            position: 'bottom',
            textStyle: {
              fontSize: 20
            }
          }
        }
      ]
    })
    const myChart4 = echarts.init(document.getElementsByClassName('chart-content')[3]);
    // 绘制图表
    myChart4.setOption({
      title: {
        text: '月销售额趋势',
      },
      xAxis: {
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      },
      yAxis: {},
      series: [
        {
          data: [10, 22, 28, 23, 19, 20, 30, 40, 50, 60, 70, 80],
          type: 'line',
          label: {
            show: true,
            position: 'bottom',
            textStyle: {
              fontSize: 20
            }
          }
        }
      ]
    })
    const myChart5 = echarts.init(document.getElementsByClassName('chart-content')[4]);
    // 绘制图表
    myChart5.setOption({
      title: {
        text: '日销售额趋势',
      },
      xAxis: {
        data: ['8-5', '8-6', '8-7', '8-8', '8-9']
      },
      yAxis: {},
      series: [
        {
          data: [10, 22, 28, 23, 19],
          type: 'line',
          label: {
            show: true,
            position: 'bottom',
            textStyle: {
              fontSize: 20
            }
          }
        }
      ]
    })
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

</style>