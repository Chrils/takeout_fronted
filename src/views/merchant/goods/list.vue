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
            <el-menu-item v-for="(goodsType,i) in goodsTypeList" :index="i+''"
                          @click="searchByType(goodsType.goodsTypeId)">
              <template slot="title">
                {{ goodsType.goodsTypeName }}
                <el-link class="el-icon-edit" @click="editCategory(goodsType.goodsTypeId)"></el-link>
                <el-link class="el-icon-delete" @click="deleteCategory(goodsType.goodsTypeId)"></el-link>
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
              <div class="goods-list-item" v-for="(goods,index) in goodsList" :key="goods.goodsId">
                <div class="goods-list-item-img" @click="toDetail">
                  <!-- <img :src="goods.goodsPic" alt=""> -->

                  <img class="img-goods" :src="goods.goodsPic" alt="">
                </div>
                <div class="goods-list-item-info">
                  <div class="goods-list-item-desc">
                    <div class="goods-list-item-info-name">{{ goods.goodsName }}</div>
                    <div class="goods-list-item-info-price">￥{{ goods.goodsPrice }}</div>
                  </div>
                  <div class="goods-list-item-operation">
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="updGoods(goods.goodsId)">编辑
                    </el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="delGoods(goods.goodsId)">删除
                    </el-button>
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
  data() {
    return {
      activeIndex: '0',
      goodsList: [],
      goodsTypeList: [],
      orgGoodsTypeId: '',
      queryInfo: {
        pageNo: 1,
        pageSize: 9,
        goodsName: '',
        goodsTypeId: ''
      },
      shopId:localStorage.getItem('shopId')
    }
  },
  created() {
    this.showCategory()
  },

  methods: {
    getGoodsList() {

    },
    handleSearch() {
      this.queryInfo.pageNo = 1;
      this.getGoodsList()
    },
    handleSelect(index) {
      this.activeIndex = index
    },
    async showCategory() {
      const {data: res} = await this.$http.get("/goods/selectGoodsTypeByShopId?shopId="+this.shopId)
      this.goodsTypeList = res.data.data
      this.orgGoodsTypeId = res.data.data[0].goodsTypeId
      this.searchByType(res.data.data[0].goodsTypeId)
    },
    addCategory() {
      this.$prompt('请输入分类名称', '添加分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{2,10}$/,
        inputErrorMessage: '请输入2-10位的中文、英文、数字组合'
      }).then(async ({value}) => {
        //判断分类名称是否存在

        const {data: rs} = await this.$http.post(`/goods/goodsTypeRule?shopId=${this.shopId}&goodsTypeName=` + value)
        if (rs.meta.status != '200') {
          this.$message({
            type: 'info',
            message: '添加分类失败,分类已存在'
          });
          return
        }

        const {data: res} = await this.$http.post(`/goods/addGoodsType?shopId=${this.shopId}&goodsTypeName=` + value)
        if (res.meta.status == '200') {
          this.$message({
            type: 'success',
            message: '成功添加分类：' + value
          });
          this.showCategory()
        } else {
          this.$message({
            type: 'success',
            message: '添加分类失败：' + value
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消添加分类'
        });
      });
    },
    updGoods(id) {
      //let order_no = this.$route.params.order_no;
      this.$router.push(`/merchant/goods/add/${id}`)
      //const:{data:res} =await this.$http.post("/goods/updGoods?goodsId="+id)
    },
    delGoods(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data: res} = await this.$http.post("/goods/delGoods?goodsId=" + id)
        if (res.meta.status == "200") {
          this.$message({
            type: 'success',
            message: '删除分类成功!'
          });
          this.searchByType(this.queryInfo.goodsTypeId)
        } else {
          this.$message({
            type: 'success',
            message: '删除分类失败!'
          });
        }

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除分类'
        });
      })
    },

    publishGoods() {
      if (this.goodsTypeList==null || this.goodsTypeList.length===0){
        return this.$message.warning('请先添加分类')
      }
      this.$router.push(`/merchant/goods/add/${-1}`)
    },
    search() {
      this.queryInfo.pageNo = 1;
      if (this.queryInfo.goodsTypeId == "") {
        this.queryInfo.goodsTypeId = this.orgGoodsTypeId
      }
      this.searchByType(this.queryInfo.goodsTypeId)
      //this.getGoodsList()
    },
    editCategory(id) {
      this.$prompt('请输入分类名称', '编辑分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{2,10}$/,
        inputErrorMessage: '请输入2-10位的中文、英文、数字组合'
      }).then(async ({value}) => {
        const {data: res} = await this.$http.post("/goods/updGoodsType?goodsTypeId=" + id + "&goodsTypeName=" + value)
        this.$message({
          type: 'success',
          message: '成功编辑分类：' + value
        });
        this.showCategory()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消编辑分类'
        });
      });
    },
    deleteCategory(id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data: res} = await this.$http.post("/goods/delGoodsType?goodsTypeId=" + id)
        if (res.meta.status == '200') {
          this.$message({
            type: 'success',
            message: '删除分类成功!'
          });
          this.showCategory()
        } else if (res.meta.status == '466') {
          this.$confirm('此分类下存在商品, 是否删除此分类及其所有商品?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            const {data: rs} = await this.$http.post("/goods/delGoodsTypeYes?goodsTypeId=" + id)
            if (rs.meta.status == '200') {
              this.$message({
                type: 'success',
                message: '删除分类成功!'
              });
              this.showCategory()
            } else {
              this.$message({
                type: 'success',
                message: '删除分类失败!'
              });
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除分类'
            });
          })
        } else {
          this.$message({
            type: 'success',
            message: '删除分类失败!'
          });
        }

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除分类'
        });
      });
    },
    toDetail() {
      this.$router.push("/merchant/goods/detail")
    },
    selectGoodsType() {
      this.$http.get('/goods/selectGoodsType')
    },
    async searchByType(id) {
      this.queryInfo.goodsTypeId = id
      const {data: res} = await this.$http.get('/goods/selectGoodsByPage', {
        params: this.queryInfo
      })
      this.goodsList = res.data.data.datas
    }
  }
}
</script>

<style scoped lang="less">
.list-header {
  display: flex;
  justify-content: space-between;
}

.goods-list-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  align-items: center;
  padding: 10px;

  > .goods-list-item {
    width: calc(100% / 3 - 20px);
    height: calc(100% / 3 - 20px);
    margin: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    > .goods-list-item-img {
      width: 100%;
      height: 100%;

      > img {
        width: 100%;
        height: 200px;
      }
    }

    > .goods-list-item-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      > .goods-list-item-desc {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        > .goods-list-item-info-name {
          font-size: 18px;
          font-weight: bold;
        }

        > .goods-list-item-info-price {
          font-size: 18px;
          font-weight: bold;
        }
      }

      > .goods-list-item-operation {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        > el-button {
          margin: 0 10px;
        }
      }
    }
  }

}
</style>