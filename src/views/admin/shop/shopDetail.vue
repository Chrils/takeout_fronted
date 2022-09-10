<template>
  <div>
    <!-- 面包屑导航区域 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <router-link to="/welcome">首页</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>店铺管理</el-breadcrumb-item>
        <el-breadcrumb-item>
          <router-link to="/shop/list">店铺列表</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>店铺详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card>

      <div id="shop-container">
        <div class="shop-pic">
          <!-- 店铺图片 -->
          <img :src="shop.img" alt="">
        </div>
        <div class="shop-desc">
          <el-row :gutter="20">
            <el-col :span="6">店铺名称</el-col>
            <el-col :span="14">
              <h3>{{shop.name}}</h3>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">店铺分类</el-col>
            <el-col :span="14">{{shop.shopTypeName}}</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">店铺地址</el-col>
            <el-col :span="14">{{shop.address}}</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">店铺负责人</el-col>
            <el-col :span="14">{{shop.username}}</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">联系电话</el-col>
            <el-col :span="14">{{shop.phone}}</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">营业时间</el-col>
            <el-col :span="14">{{shop.workTime}}</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">营业状态</el-col>
            <el-col :span="14">
              <el-tag v-if="shop.openStat===1" type="success">营业中</el-tag>
              <el-tag v-else type="warning">打烊中</el-tag>
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
      <!-- 折叠项 -->
      <el-collapse v-model="activeNames">
        <el-collapse-item title="商家公告" name="1">
          <p>{{shop.notice}}</p>
        </el-collapse-item>
        <el-collapse-item title="商家商品信息" name="2">
          <div>
            <el-row :gutter="10">
              <el-col :span="5">
                <el-select v-model="goodsQueryInfo.goodsType" placeholder="请选择商品分类">
                  <el-option v-for="item in typeList" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-input placeholder="请输入内容" v-model="goodsQueryInfo.name" class="input-with-select">
                  <el-button slot="append" icon="el-icon-search" @click="searchGoodsList"></el-button>
                </el-input>
              </el-col>
              <el-col :span="11">
                <div class="multi-right">
                  <el-button type="danger" @click="handleMultiDelete">批量下架</el-button>
                </div>
              </el-col>
            </el-row>
            <!-- 列表视图 -->
            <el-table
                :data="goodsList"
                border stripe ref="multipleTable">
              <el-table-column
                  type="selection">
              </el-table-column>
              <el-table-column
                  type="index"
                  label="#">
              </el-table-column>
              <el-table-column
                  prop="goodsName"
                  label="商品名称"
                  show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                  label="商品分类">
                <template v-slot="scope">
                  <span>{{ scope.row.typeName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                  prop="goodsPrice"
                  label="商品价格">
              </el-table-column>
              <el-table-column
                label="商品图片"
                width="180">
                <template v-slot="scope">
                  <img :src="scope.row.goodsImg" width="100" height="100" alt=""/>
                </template>
              </el-table-column>
              <el-table-column
                  label="操作"
                  width="180">
                <template v-slot="scope">
                  <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDelete(scope.row)">下架
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页视图 -->
            <el-pagination
                @size-change="handleGoodsSizeChange"
                @current-change="handleGoodsCurrentChange"
                :current-page="goodsQueryInfo.page"
                :page-sizes="pageSizes"
                :page-size="goodsQueryInfo.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="goodsTotal">
            </el-pagination>
          </div>
        </el-collapse-item>
      </el-collapse>
      <!-- 店铺操作 -->
      <div class="shop-operate">
        <el-button type="primary" @click="handleShopNotify">违规警告通知</el-button>
        <el-button type="danger" @click="handleShopDown">下架店铺</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "shopDetail",
  data() {
    return {
      value: 4.5,
      activeNames: [],
      pageSizes: [10, 20, 30, 40],
      goodsQueryInfo: {
        name: "",
        page: 1,
        pageSize: 10,
        shopId: this.$route.params.id,
        goodsType: ""
      },
      goodsList: [
        {
          id: 1,
          goodsName: "啤酒鸭",
          goodsPrice: "￥20",
          goodsImg: "https://img2.baidu.com/it/u=1351163842,4209563880&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667",
          typeName: "聚餐大份"
        },
        {
          id: 2,
          goodsName: "啤酒鸭",
          goodsPrice: "￥20",
          goodsImg: "https://img2.baidu.com/it/u=1351163842,4209563880&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667",
          typeName: "聚餐大份"
        },
        {
          id: 3,
          goodsName: "啤酒鸭",
          goodsPrice: "￥20",
          goodsImg: "https://img2.baidu.com/it/u=1351163842,4209563880&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667",
          typeName: "聚餐大份"
        },
        {
          id: 4,
          goodsName: "啤酒鸭",
          goodsPrice: "￥20",
          goodsImg: "https://img2.baidu.com/it/u=1351163842,4209563880&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667",
          typeName: "聚餐大份"
        },
        {
          id: 5,
          goodsName: "啤酒鸭",
          goodsPrice: "￥20",
          goodsImg: "https://img2.baidu.com/it/u=1351163842,4209563880&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667",
          typeName: "聚餐大份"
        },

      ],
      goodsTotal: 5,
      typeList: [
        {
          id: 1,
          name: "聚餐大份"
        },
        {
          id: 2,
          name: "聚餐小份"
        },
        {
          id: 3,
          name: "聚餐中份"
        }
      ],
      shopId: this.$route.params.shop_id,
      shop:{}
    }
  },
  methods: {
    handleGoodsSizeChange(val) {
      this.goodsQueryInfo.pageSize = val;
      this.goodsQueryInfo.page = 1;
      this.getGoodsList();
    },
    handleGoodsCurrentChange(val) {
      this.goodsQueryInfo.page = val;
      this.getGoodsList();
    },
    handleDelete(row) {
      this.$confirm('确定删除该商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleMultiDelete() {
      this.$confirm('确定删除选中的商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    searchTypeList() {
      this.getTypeList();
    },
    searchGoodsList() {
      this.goodsQueryInfo.page = 1;
      this.getGoodsList();
    },
    getGoodsList() {
    },
    getTypeList() {
    },
    handleShopNotify() {
      this.$confirm('确定发送违规警告通知吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '发送成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发送'
        });
      });
    },
    handleShopDown() {
      this.$confirm('确定下架该店铺吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '下架成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消下架'
        });
      });
    },
    async getShopDetail(){
      const {data:res} = await this.$http.get(`/consumer/admin/shop/detail/${this.shopId}`);
      if(res.meta.status !== "200") return this.$message.error(res.meta.msg);
      this.shop = res.data.data;
    }
  },
  created() {
    this.getShopDetail();
  }
}
</script>

<style scoped lang="less">
#shop-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  > .shop-pic{
    width: 40%;
    > img{
      width: 100%;
    }
  }
  > .shop-desc {
    width: 55%;
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

</style>