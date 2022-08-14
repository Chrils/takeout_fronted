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
              placeholder="请选择省市区">
          </el-cascader>
        </el-col>
        <el-col :span="6">
          <!-- 级联选择框渲染 -->
          <el-cascader
              v-model="selectedKeys"
              :options="cateList"
              :props="cascaderProps"
              @change="handleCascaderChange"
              placeholder="请选择分类">
          </el-cascader>
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
            prop="shopName"
            label="商品名称"
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
          :current-page="queryInfo.page"
          :page-sizes="pageSizes"
          :page-size="queryInfo.size"
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
        cateId: 1,
        cateLevel: 0,
        page: 1,
        size: 10,
        latitude: "",
        longitude: ""
      },
      total: 0,
      shopList: [
        {
          id: 1,
          shopName: "商品名称",
          shopTypeName: "店铺分类",
          address: "店铺地址",
          shopTypeId: 1,
          shopTypeLevel: 1,
          latitude: "",
          longitude: ""
        },
        {
          id: 2,
          shopName: "商品名称",
          shopTypeName: "店铺分类",
          address: "店铺地址",
          shopTypeId: 1,
          shopTypeLevel: 1,
          latitude: "",
          longitude: ""
        },
        {
          id: 3,
          shopName: "商品名称",
          shopTypeName: "店铺分类",
          address: "店铺地址",
          shopTypeId: 1,
          shopTypeLevel: 1,
          latitude: "",
          longitude: ""
        }
      ],
      cateList: [
        {
          id:1,
          name: "美食",
          children: [
            {
              id:2,
              name: "火锅",
              children: [
                {
                  id:3,
                  name: "川菜"
                },
                {
                  id:4,
                  name: "湘菜"
                }
              ]
            },
            {
              id:5,
              name: "烧烤",
              children: [
                {
                  id:6,
                  name: "烤鸭"
                },
                {
                  id:7,
                  name: "烤鱼"
                }
              ]
            }
          ]
        },
        {
          id:8,
          name: "甜点饮品",
          children: [
            {
              id:9,
              name: "糖果"
            },
            {
              id:10,
              name: "冰淇淋"
            }
          ]
        }
      ],
      selectedKeys: [],
      cascaderProps: {
        value: "id",
        label: "name",
        children: "children"
      },
      pageSizes: [5, 10, 15, 20],
      mapVisible: false,
      options: regionData,
      selectedOptions:[],
    }
  },
  methods:{
    handleDetail(){
      this.$router.push("/shop/detail")
    },
    handleDown(){

    },
    searchShopList(){
      this.queryInfo.page = 1
      this.getShopList()
    },
    handleSizeChange(val){
      this.queryInfo.size = val
      this.getShopList()
    },
    handleCurrentChange(val){
      this.queryInfo.page = val
      this.getShopList()
    },
    getShopList(){

    },
    handleCascaderChange(){
      // this.queryInfo.cateId = this.selectedKeys[this.selectedKeys.length - 1]
      // this.queryInfo.cateLevel = this.selectedKeys.length
      // this.getShopList()
    }
  }
}
</script>

<style scoped>

</style>