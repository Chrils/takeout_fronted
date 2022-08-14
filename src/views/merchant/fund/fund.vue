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
        <div class="money-amount">￥{{fund.amount}}</div>
      </div>
      <div class="money-action">
        <el-button type="primary" @click="showDrawer">提现</el-button>
      </div>
    </div>
    <div class="fund-query">
      <div>
        <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择开始时间" style="width: 200px;"></el-date-picker>
        <span style="margin: 0 5px;">-</span>
        <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择结束时间" style="width: 200px;"></el-date-picker>
      </div>
      <div>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button type="warning" @click="handleQuery">导出</el-button>
      </div>
    </div>
    <div class="fund-details">
      <div class="fund-detail">
        <div class="fund-detail-title">支入记录</div>
        <div class="fund-detail-list">
          <div class="fund-detail-item">
            <div class="fund-item-title">订单收益</div>
            <div class="fund-item-time">2022-4-6 10:20:30</div>
            <div class="fund-item-amount">
              <span class="fund-item-amount-income">+{{'35.00'}}</span>
            </div>
          </div>
          <div class="fund-detail-item">
            <div class="fund-item-title">订单收益</div>
            <div class="fund-item-time">2022-4-6 10:20:30</div>
            <div class="fund-item-amount">
              <span class="fund-item-amount-income">+{{'35.00'}}</span>
            </div>
          </div>
          <div class="fund-detail-item">
            <div class="fund-item-title">订单收益</div>
            <div class="fund-item-time">2022-4-6 10:20:30</div>
            <div class="fund-item-amount">
              <span class="fund-item-amount-income">+{{'35.00'}}</span>
            </div>
          </div>
          <div class="fund-detail-item">
            <div class="fund-item-title">订单收益</div>
            <div class="fund-item-time">2022-4-6 10:20:30</div>
            <div class="fund-item-amount">
              <span class="fund-item-amount-income">+{{'35.00'}}</span>
            </div>
          </div>
          <div class="fund-detail-item">
            <div class="fund-item-title">订单收益</div>
            <div class="fund-item-time">2022-4-6 10:20:30</div>
            <div class="fund-item-amount">
              <span class="fund-item-amount-income">+{{'35.00'}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="fund-detail">
        <div class="fund-detail-title">支出记录</div>
        <div class="fund-detail-list">
          <div class="fund-detail-item">
            <div class="fund-item-title">收益提现</div>
            <div class="fund-item-time">2022-4-6 10:20:30</div>
            <div class="fund-item-amount">
              <span class="fund-item-amount-expend">-{{'300.00'}}</span>
            </div>
          </div>
          <div class="fund-detail-item">
            <div class="fund-item-title">收益提现</div>
            <div class="fund-item-time">2022-4-6 10:20:30</div>
            <div class="fund-item-amount">
              <span class="fund-item-amount-expend">-{{'300.00'}}</span>
            </div>
          </div>
          <div class="fund-detail-item">
            <div class="fund-item-title">收益提现</div>
            <div class="fund-item-time">2022-4-6 10:20:30</div>
            <div class="fund-item-amount">
              <span class="fund-item-amount-expend">-{{'300.00'}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-card>

</div>
</template>

<script>
export default {
  name: "fund",
  data(){
    return {
      fund: {
        amount: 999.89,
      },
      form: {
        startTime: '',
        endTime: '',
      },
    }
  }
}
</script>

<style scoped lang="less">
.fund-top{
  display: flex;
  justify-content: space-between;
  align-items: center;
  >.money{
    display: flex;
    align-items: center;
    >.money-title{
      font-size: 16px;
      font-weight: bold;
      margin-right: 10px;
    }
    >.money-amount{
      font-size: 20px;
      font-weight: bold;
      color: #f50;
    }
  }
}
.fund-details{
  display: flex;
  justify-content: space-between;
  >.fund-detail{
    width: 50%;
    >.fund-detail-title{
      margin-top: 20px;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    >.fund-detail-list{
      >.fund-detail-item{
        display: flex;
        width: 100%;
        margin: 16px 0;
        background-color: #fff;
        >.fund-item-title{
          font-size: 14px;
          color: #333;
          width: 130px;
        }
        >.fund-item-time{
          font-size: 12px;
          color: #999;
          width: 230px;
        }
        >.fund-item-amount{
          display: flex;
          align-items: center;
          >.fund-item-amount-income{
            font-size: 14px;
            color: dodgerblue;
            margin-right: 10px;
          }
          >.fund-item-amount-expend{
            font-size: 14px;
            color: #f50;
          }
        }
      }
    }
  }
}

.fund-query{
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
</style>