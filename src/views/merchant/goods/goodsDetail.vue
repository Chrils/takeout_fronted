<template>
<div>
  <!-- 面包屑导航区域 -->
  <div class="breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        <router-link to="/welcome">首页</router-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>
        <router-link to="/merchant/goods/list">商品列表</router-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

  <el-card>
    <div id="shop-container">
      <div class="shop-pic">
        <!-- 商品图片 -->
        <img src="https://img2.baidu.com/it/u=1351163842,4209563880&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667" alt="">
      </div>
      <div class="shop-desc">
        <el-row :gutter="20">
          <el-col :span="6">商品名称</el-col>
          <el-col :span="14">
            <h3>花雕醉鸡2-4人份</h3>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">商品分类</el-col>
          <el-col :span="14">花雕经典</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">商品价格</el-col>
          <el-col :span="14">128.00</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">月售量</el-col>
          <el-col :span="14">666</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">好评度</el-col>
          <el-col :span="14">100%</el-col>
        </el-row>
      </div>
    </div>

    <div class="goods-params-container">
      <div class="goods-params-item">
        <div class="goods-params-item-title">
          规格参数
        </div>
        <div class="goods-params-item-list">
          <div class="goods-params-item-list-title">甜度</div>
          <div class="goods-params-item-content">
            <el-button type="primary" plain size="small">全糖</el-button>
            <el-button type="primary" plain size="small">半糖</el-button>
            <el-button type="primary" plain size="small">三分糖</el-button>
            <el-button type="primary" plain size="small">无糖</el-button>
          </div>
        </div>
        <div class="goods-params-item-list">
          <div class="goods-params-item-list-title">分量</div>
          <div class="goods-params-item-content">
            <el-button type="primary" plain size="small">超大号</el-button>
            <el-button type="primary" plain size="small">大号</el-button>
            <el-button type="primary" plain size="small">标号</el-button>
            <el-button type="primary" plain size="small">小号</el-button>
          </div>
        </div>
      </div>
      <div class="goods-params-item">
        <div class="goods-params-item-title">
          详情信息
        </div>
        <div class="goods-params-item-list">
          <div class="goods-params-item-list-title">食材</div>
          <div class="goods-params-item-content">
            <el-button type="primary" plain size="small">鸡肉、洋葱、玉米、土豆、花雕酒</el-button>
          </div>
        </div>
        <div class="goods-params-item-list">
          <div class="goods-params-item-list-title">口味</div>
          <div class="goods-params-item-content">
            <el-button type="primary" plain size="small">湘菜微辣</el-button>
          </div>
        </div>
      </div>
      <div class="goods-params-item">
        <div class="goods-params-item-title">
          评价信息
        </div>
        <div class="goods-comments-item-list">
          <div class="goods-comments-item-list-avatar">
            <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="">
          </div>
          <div class="goods-comments-item-list-title">张三</div>
          <div class="goods-comments-item-list-stars">
            <div class="goods-comments-item-list-stars-attitude">
              <span>服务态度: </span>
              <el-rate
                  v-model="value"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}">
              </el-rate>
            </div>
          </div>
          <div class="goods-comments-item-list-stars">
            <div class="goods-comments-item-list-stars-attitude">
              <span>菜品口味: </span>
              <el-rate
                  v-model="value"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}">
              </el-rate>
            </div>
          </div>
          <div class="goods-comments-item-content">
            <div class="goods-comments-item-content-pic">
              <img src="https://img2.baidu.com/it/u=1351163842,4209563880&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667" alt="">
            </div>
            <div class="goods-comments-item-text">味道还不错</div>
          </div>
          <div class="goods-comments-item-list-time">
            <span>2019-01-01</span>
          </div>
          <div class="goods-comments-item-list-option">
            <el-button type="primary" icon="el-icon-right" size="small">回复</el-button>
          </div>
        </div>
        <div class="goods-comments-item-list">
          <div class="goods-comments-item-list-avatar">
            <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="">
          </div>
          <div class="goods-comments-item-list-title">张三</div>
          <div class="goods-comments-item-list-stars">
            <div class="goods-comments-item-list-stars-attitude">
              <span>服务态度: </span>
              <el-rate
                  v-model="value"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}">
              </el-rate>
            </div>
          </div>
          <div class="goods-comments-item-list-stars">
            <div class="goods-comments-item-list-stars-attitude">
              <span>菜品口味: </span>
              <el-rate
                  v-model="value"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}">
              </el-rate>
            </div>
          </div>
          <div class="goods-comments-item-content">
            <div class="goods-comments-item-content-pic">
              <img src="https://img2.baidu.com/it/u=1351163842,4209563880&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667" alt="">
            </div>
            <div class="goods-comments-item-text">味道还不错</div>
          </div>
          <div class="goods-comments-item-list-time">
            <span>2019-01-01</span>
          </div>
          <div class="goods-comments-item-list-option">
            <el-button type="primary" icon="el-icon-right" size="small">回复</el-button>
          </div>
        </div>
        <div class="goods-comments-item-list">
          <div class="goods-comments-item-list-avatar">
            <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="">
          </div>
          <div class="goods-comments-item-list-title">张三</div>
          <div class="goods-comments-item-list-stars">
            <div class="goods-comments-item-list-stars-attitude">
              <span>服务态度: </span>
              <el-rate
                  v-model="value"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}">
              </el-rate>
            </div>
          </div>
          <div class="goods-comments-item-list-stars">
            <div class="goods-comments-item-list-stars-attitude">
              <span>菜品口味: </span>
              <el-rate
                  v-model="value"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}">
              </el-rate>
            </div>
          </div>
          <div class="goods-comments-item-content">
            <div class="goods-comments-item-content-pic">
              <img src="https://img2.baidu.com/it/u=1351163842,4209563880&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667" alt="">
            </div>
            <div class="goods-comments-item-text">味道还不错</div>
          </div>
          <div class="goods-comments-item-list-time">
            <span>2019-01-01</span>
          </div>
          <div class="goods-comments-item-list-option">
            <el-button type="primary" icon="el-icon-right" size="small">回复</el-button>
          </div>
        </div>
        <div class="goods-comments-item-list">
          <div class="goods-comments-item-list-avatar">
            <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="">
          </div>
          <div class="goods-comments-item-list-title">张三</div>
          <div class="goods-comments-item-list-stars">
            <div class="goods-comments-item-list-stars-attitude">
              <span>服务态度: </span>
              <el-rate
                  v-model="value"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}">
              </el-rate>
            </div>
          </div>
          <div class="goods-comments-item-list-stars">
            <div class="goods-comments-item-list-stars-attitude">
              <span>菜品口味: </span>
              <el-rate
                  v-model="value"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}">
              </el-rate>
            </div>
          </div>
          <div class="goods-comments-item-content">
            <div class="goods-comments-item-content-pic">
              <img src="https://img2.baidu.com/it/u=1351163842,4209563880&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667" alt="">
            </div>
            <div class="goods-comments-item-text">味道还不错</div>
          </div>
          <div class="goods-comments-item-list-time">
            <span>2019-01-01</span>
          </div>
          <div class="goods-comments-item-list-option">
            <el-button type="primary" icon="el-icon-right" size="small">回复</el-button>
          </div>
        </div>
        <div class="goods-comments-item-list">
          <div class="goods-comments-item-list-avatar">
            <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="">
          </div>
          <div class="goods-comments-item-list-title">张三</div>
          <div class="goods-comments-item-list-stars">
            <div class="goods-comments-item-list-stars-attitude">
              <span>服务态度: </span>
              <el-rate
                  v-model="value"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}">
              </el-rate>
            </div>
          </div>
          <div class="goods-comments-item-list-stars">
            <div class="goods-comments-item-list-stars-attitude">
              <span>菜品口味: </span>
              <el-rate
                  v-model="value"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}">
              </el-rate>
            </div>
          </div>
          <div class="goods-comments-item-content">
            <div class="goods-comments-item-content-pic">
              <img src="https://img2.baidu.com/it/u=1351163842,4209563880&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667" alt="">
            </div>
            <div class="goods-comments-item-text">味道还不错</div>
          </div>
          <div class="goods-comments-item-list-time">
            <span>2019-01-01</span>
          </div>
          <div class="goods-comments-item-list-option">
            <el-button type="primary" icon="el-icon-right" size="small">回复</el-button>
          </div>
        </div>
      </div>
    </div>



  </el-card>

</div>
</template>

<script>
export default {
  name: "goodsDetail",
  data(){
    return{
      value: 4.8,
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

  >.shop-desc {
    width: 60%;
    margin-left: 20px;
    height: 100%;
    line-height: 40px;
  }

  >.shop-pic {
    width: 40%;
    height: 100%;
    display: flex;
    justify-content: center;
    >img {
      height: 300px;
    }
  }
}
.goods-params-container{
  margin-bottom: 20px;
  >.goods-params-item{
    >.goods-params-item-title{
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
      border-top: 2px solid #767676;
      padding-top: 15px;
    }
    >.goods-params-item-list{
      display: flex;
      justify-content: left;
      >.goods-params-item-list-title{
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 10px;
        width: 30%;
        line-height: 40px;
      }
      >.goods-params-item-content{
        >.el-button{
          margin-right: 10px;
        }
      }
    }
    >.goods-comments-item-list{
      display: flex;
      justify-content: left;
      margin: 20px 0;
      >.goods-comments-item-list-avatar{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        >img{
          width: 100%;
          height: 100%;
        }
      }
      >.goods-comments-item-list-stars{
        font-size: 14px;
        font-weight: normal;
        margin-left: 30px;
      }
      >.goods-comments-item-list-title{
        width: 13%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 10px;
        line-height: 40px;
      }
      >.goods-comments-item-content{
        width: 35%;
        height: 100%;
        display: flex;
        justify-content: left;
        >.goods-comments-item-content-pic{
          display: flex;
          justify-content: center;
          align-items: center;
          width: 50%;
          >img{
            width: 50px;
            height: 50px;
          }
        }
        >.goods-comments-item-text{
          width: 80%;
          height: 100%;
          display: flex;
          justify-content: left;
          align-items: center;
          font-size: 14px;
          line-height: 40px;
          margin-left: 20px;
        }
      }
      >.goods-comments-item-list-time{
        width: 13%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: normal;
        margin-bottom: 10px;
        line-height: 40px;
      }
    }
  }
}
</style>