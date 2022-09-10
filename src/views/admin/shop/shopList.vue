<template>
  <div>
    <!-- 面包屑导航区域 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <router-link to="/welcome">首页</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>店铺管理</el-breadcrumb-item>
        <el-breadcrumb-item>店铺列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="6">
          <!-- 级联选择框渲染 -->
          <el-cascader
              v-model="selectedOptions"
              :options="options"
              placeholder="请选择省市区"
              @change="handleCascaderChange">
          </el-cascader>
        </el-col>
        <el-col :span="6">
          <el-select v-model="queryInfo.shopType" placeholder="请选择" @change="handleTypeChange">
            <el-option label="全部" :value="-1"></el-option>
            <el-option v-for="item in cateList" :label="item.name" :key="item.name" :value="item.id"></el-option>
          </el-select>

        </el-col>
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.name" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchShopList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 列表视图 -->
      <el-table
          :data="shopList"
          border stripe>
        <el-table-column
            type="index"
            label="#">
        </el-table-column>
        <el-table-column
            prop="name"
            label="店铺名称"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            prop="shopTypeName"
            label="店铺分类">
        </el-table-column>
        <el-table-column
            prop="address"
            label="店铺地址"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            label="操作"
            width="180">
          <template v-slot="scope">
            <el-button type="primary" size="small" @click="handleDetail(scope.row)">查看</el-button>
            <el-button type="danger" size="small" @click="handleDown(scope.row)">下线</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页视图 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNo"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>


  </div>
</template>

<script>
import { regionData,CodeToText } from 'element-china-area-data'

export default {
  name: "shopList",
  data(){
    return{
      queryInfo: {
        goodsName: "",
        province: "",
        city: "",
        area: "",
        shopType: -1
      },
      pageNo: 1,
      pageSize: 10,
      total: 0,
      shopList: [],
      cateList: [],
      selectedKeys: [],
      pageSizes: [5, 10, 15, 20],
      mapVisible: false,
      options: regionData,
      selectedOptions:[],
    }
  },
  methods:{
    handleDetail(row){
      this.$router.push("/shop/detail/"+row.id)
    },
    handleDown(row){
      this.$confirm('确定下线该店铺吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`/consumer/admin/shop/down/${row.id}`).then(res=>{
          if(res.data.meta.status==="200"){
            this.$message.success("下线成功")
            this.searchShopList()
          }else{
            this.$message.error(res.data.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消下线'
        });
      });
    },
    searchShopList(){
      this.pageNo = 1
      this.getShopList()
    },
    handleSizeChange(val){
      this.pageSize = val
      this.getShopList()
    },
    handleCurrentChange(val){
      this.pageNo = val
      this.getShopList()
    },
    async getShopList(){
      const {data:res} = await this.$http.post("/consumer/admin/shop/list/"+this.pageNo+"/"+this.pageSize, this.queryInfo);
      if (res.meta.status !== "200") return this.$message.error(res.meta.msg)
      this.shopList = res.data.data.records;
      this.total = res.data.data.total;
    },
    handleTypeChange(val){
      this.queryInfo.shopType = val
      this.getShopList()
    },
    async getCateList(){
      const {data:res} = await this.$http.get("/consumer/client/shop-type/list/without-page")
      if (res.meta.status !== "200") return this.$message.error(res.meta.msg)
      this.cateList = res.data.data;
    },
    handleCascaderChange(val){
      this.queryInfo.province = val[0]===undefined? "":CodeToText[val[0]]
      this.queryInfo.city = val[1]===undefined? "":CodeToText[val[1]]
      this.queryInfo.area = val[2]===undefined? "":CodeToText[val[2]]
      this.getShopList()
    },

  },
  created(){
    this.getCateList()
    this.getShopList()
  }
}
</script>

<style scoped>

</style>