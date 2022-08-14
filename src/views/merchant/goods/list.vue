<template>
<div>
  <el-card>
    <el-container>
      <!-- 侧边栏放菜品的分类信息 -->
      <el-aside width="270">
        <el-menu :default-active="activeIndex" mode="vertical" @select="handleSelect">
          <!-- 添加分类 -->
          <el-menu-item index="1-0">
            <template slot="title">
              <el-button type="plain" icon="el-icon-plus" @click="addCategory"></el-button>
            </template>
          </el-menu-item>
          <!-- 仅支持一级菜单 -->
          <el-menu-item index="1-1">
            <template slot="title">
              菜品分类1
              <el-link class="el-icon-edit" @click="editCategory"></el-link>
              <el-link class="el-icon-delete" @click="deleteCategory"></el-link>
            </template>
          </el-menu-item>
          <el-menu-item index="1-2">
            <template slot="title">
              菜品分类2
              <el-link class="el-icon-edit" @click="editCategory"></el-link>
              <el-link class="el-icon-delete" @click="deleteCategory"></el-link>
            </template>
          </el-menu-item>
          <el-menu-item index="1-3">
            <template slot="title">
              菜品分类3
              <el-link class="el-icon-edit" @click="editCategory"></el-link>
              <el-link class="el-icon-delete" @click="deleteCategory"></el-link>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="list-header">
            <el-input placeholder="请输入菜品名称" style="width: 600px" v-model="queryInfo.goodsName"></el-input>
            <div>
              <el-button type="primary" icon="el-icon-plus" @click="publishGoods">商品上架</el-button>
              <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>

          </div>
        </el-header>
        <el-main>
          <div class="goods-list-container">
            <div class="goods-list-item">
              <div class="goods-list-item-img" @click="toDetail">
                <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="">
              </div>
              <div class="goods-list-item-info">
                <div class="goods-list-item-desc">
                  <div class="goods-list-item-info-name">菜品名称</div>
                  <div class="goods-list-item-info-price">￥100</div>
                </div>
                <div class="goods-list-item-operation">
                  <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </div>
              </div>
            </div>
            <div class="goods-list-item">
              <div class="goods-list-item-img">
                <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="">
              </div>
              <div class="goods-list-item-info">
                <div class="goods-list-item-desc">
                  <div class="goods-list-item-info-name">菜品名称</div>
                  <div class="goods-list-item-info-price">￥100</div>
                </div>
                <div class="goods-list-item-operation">
                  <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </div>
              </div>
            </div>
            <div class="goods-list-item">
              <div class="goods-list-item-img">
                <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="">
              </div>
              <div class="goods-list-item-info">
                <div class="goods-list-item-desc">
                  <div class="goods-list-item-info-name">菜品名称</div>
                  <div class="goods-list-item-info-price">￥100</div>
                </div>
                <div class="goods-list-item-operation">
                  <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </div>
              </div>
            </div>
            <div class="goods-list-item">
              <div class="goods-list-item-img">
                <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="">
              </div>
              <div class="goods-list-item-info">
                <div class="goods-list-item-desc">
                  <div class="goods-list-item-info-name">菜品名称</div>
                  <div class="goods-list-item-info-price">￥100</div>
                </div>
                <div class="goods-list-item-operation">
                  <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </div>
              </div>
            </div>
            <div class="goods-list-item">
              <div class="goods-list-item-img">
                <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="">
              </div>
              <div class="goods-list-item-info">
                <div class="goods-list-item-desc">
                  <div class="goods-list-item-info-name">菜品名称</div>
                  <div class="goods-list-item-info-price">￥100</div>
                </div>
                <div class="goods-list-item-operation">
                  <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </div>
              </div>
            </div>
            <div class="goods-list-item">
              <div class="goods-list-item-img">
                <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="">
              </div>
              <div class="goods-list-item-info">
                <div class="goods-list-item-desc">
                  <div class="goods-list-item-info-name">菜品名称</div>
                  <div class="goods-list-item-info-price">￥100</div>
                </div>
                <div class="goods-list-item-operation">
                  <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </div>
              </div>
            </div>
            <div class="goods-list-item">
              <div class="goods-list-item-img">
                <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="">
              </div>
              <div class="goods-list-item-info">
                <div class="goods-list-item-desc">
                  <div class="goods-list-item-info-name">菜品名称</div>
                  <div class="goods-list-item-info-price">￥100</div>
                </div>
                <div class="goods-list-item-operation">
                  <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </div>
              </div>
            </div>
            <div class="goods-list-item">
              <div class="goods-list-item-img">
                <img src="https://img.yzcdn.cn/vant/cat.jpeg" alt="">
              </div>
              <div class="goods-list-item-info">
                <div class="goods-list-item-desc">
                  <div class="goods-list-item-info-name">菜品名称</div>
                  <div class="goods-list-item-info-price">￥100</div>
                </div>
                <div class="goods-list-item-operation">
                  <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-card>
</div>
</template>

<script>
export default {
  name: "list",
  data(){
    return{
      activeIndex: '1',
      goodsList:[],
      queryInfo:{
        page: 1,
        pageSize: 10,
        goodsName: ''
      },
    }
  },
  methods:{
    getGoodsList(){

    },
    handleSearch(){
      this.queryInfo.page = 1;
      this.getGoodsList()
    },
    handleSelect(index){
      this.activeIndex = index
    },
    addCategory(){
      this.$prompt('请输入分类名称', '添加分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{2,10}$/,
        inputErrorMessage: '请输入2-10位的中文、英文、数字组合'
      }).then(({value}) => {
        this.$message({
          type: 'success',
          message: '成功添加分类：' + value
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消添加分类'
        });
      });
    },
    publishGoods(){
      this.$router.push("/merchant/goods/add")
    },
    search(){
      this.queryInfo.page = 1;
      this.getGoodsList()
    },
    editCategory(){
      this.$prompt('请输入分类名称', '编辑分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{2,10}$/,
        inputErrorMessage: '请输入2-10位的中文、英文、数字组合'
      }).then(({value}) => {
        this.$message({
          type: 'success',
          message: '成功编辑分类：' + value
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消编辑分类'
        });
      });
    },
    deleteCategory(){
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除分类成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除分类'
        });
      });
    },
    toDetail(){
      this.$router.push("/merchant/goods/detail")
    }
  }
}
</script>

<style scoped lang="less">
.list-header{
  display: flex;
  justify-content: space-between;
}
.goods-list-container{
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  align-items: center;
  padding: 10px;
  >.goods-list-item{
    width: calc(100% / 3 - 20px);
    height: calc(100% / 3 - 20px);
    margin: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    >.goods-list-item-img{
      width: 100%;
      height: 100%;
      >img{
        width: 100%;
        height: 100%;
      }
    }
    >.goods-list-item-info{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      >.goods-list-item-desc{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        >.goods-list-item-info-name{
          font-size: 18px;
          font-weight: bold;
        }
        >.goods-list-item-info-price{
          font-size: 18px;
          font-weight: bold;
        }
      }
      >.goods-list-item-operation{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        >el-button{
          margin: 0 10px;
        }
      }
    }
  }

}
</style>