<template>
  <div>
    <!-- 面包屑导航区域 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <router-link to="/welcome">首页</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>店铺管理</el-breadcrumb-item>
        <el-breadcrumb-item>店铺审核</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card>
      <el-table :data="shopList" border stripe>
        <el-table-column label="店铺名称" prop="shopName" width="180"></el-table-column>
        <el-table-column label="店铺地址" prop="address" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column label="申请人姓名" prop="realName" width="100"></el-table-column>
        <el-table-column label="联系电话" prop="phone" width="150"></el-table-column>
        <el-table-column label="店铺类型" prop="shopTypeName" width="100"></el-table-column>
        <el-table-column label="营业执照" prop="license">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleView(scope.row.license)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="身份证正面" prop="idCard">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleView(scope.row.idCard)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="个人身份验证状态" prop="idCartStat" width="180">
          <template slot-scope="scope">
            <el-tag type="info"  v-if="scope.row.idCartStat === 0">认证中</el-tag>
            <el-tag type="success" v-if="scope.row.idCartStat === 1">已通过</el-tag>
            <el-tag type="danger" v-if="scope.row.idCartStat === 2">与申请人姓名不匹配</el-tag>
            <el-tag type="danger" v-if="scope.row.idCartStat === 3">未通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" :disabled="scope.row.idCartStat === 0" @click="handleReview(scope.row)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页条 -->
      <el-pagination
          @current-change="handleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :current-page.sync="queryInfo.pageNo"
          :page-size="queryInfo.pageSize">
      </el-pagination>

    </el-card>

    <el-dialog title="查看图片" :visible.sync="dialogVisible" width="30%">
      <img :src="dialogImage" alt="" style="width: 80%">
    </el-dialog>

    <!-- 审核对话框 -->
    <el-dialog title="审核" :visible.sync="reviewVisible" width="30%">
      <el-form :model="reviewForm" label-width="80px" :rules="reviewRules" ref="reviewForm">
        <el-form-item label="审核结果" prop="reviewStat">
          <el-radio-group v-model="reviewForm.reviewStat">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见" prop="reviewMsg">
          <el-input type="textarea" v-model="reviewForm.reviewMsg" placeholder="请输入审核意见"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reviewVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleReviewSubmit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "shopReview",
  data() {
    return {
      shopList: [
        {
          id:1,
          shopName: "苏宁易购",
          address: "河北省石家庄市111111111111111111111111111111111111111111111",
          realName: "张三",
          phone: "13000000000",
          shopTypeName: "超市",
          license: "https://img1.baidu.com/it/u=311462839,333504953&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=666",
          idCard: "https://img2.baidu.com/it/u=2543475333,980829165&fm=253&fmt=auto&app=138&f=JPEG?w=600&h=450",
          idCartStat: 0
        },
        {
          id:2,
          shopName: "苏宁易购",
          address: "河北省石家庄市",
          realName: "张三",
          phone: "13000000000",
          shopTypeName: "超市",
          license: "https://img1.baidu.com/it/u=311462839,333504953&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=666",
          idCard: "https://img2.baidu.com/it/u=2543475333,980829165&fm=253&fmt=auto&app=138&f=JPEG?w=600&h=450",
          idCartStat: 1
        },
        {
          id:3,
          shopName: "苏宁易购",
          address: "河北省石家庄市",
          realName: "张三",
          phone: "13000000000",
          shopTypeName: "超市",
          license: "https://img1.baidu.com/it/u=311462839,333504953&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=666",
          idCard: "https://img2.baidu.com/it/u=2543475333,980829165&fm=253&fmt=auto&app=138&f=JPEG?w=600&h=450",
          idCartStat: 2
        },
        {
          id:4,
          shopName: "苏宁易购",
          address: "河北省石家庄市",
          realName: "张三",
          phone: "13000000000",
          shopTypeName: "超市",
          license: "https://img1.baidu.com/it/u=311462839,333504953&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=666",
          idCard: "https://img2.baidu.com/it/u=2543475333,980829165&fm=253&fmt=auto&app=138&f=JPEG?w=600&h=450",
          idCartStat: 3
        }
      ],
      queryInfo: {
        pageNo: 1,
        pageSize: 5,
      },
      dialogVisible: false,
      dialogImage: "",
      reviewVisible: false,
      reviewForm: {
        reviewStat: 1,
        reviewMsg: ""
      },
      reviewRules: {
        reviewMsg: [
          { required: true, message: "请输入审核意见", trigger: "blur" }
        ]
      },
      total: 0,

    }
  },
  methods:{
    handleReview(row) {
      this.reviewForm.id = row.id;
      this.reviewVisible = true;
    },
    handleReviewSubmit() {
      this.$refs.reviewForm.validate((valid) => {
        if (valid) {
          this.$message({
            message: "审核成功",
            type: "success"
          });
          this.reviewVisible = false;
        } else {
          return false;
        }
      });
    },
    handleReviewCancel() {
      this.reviewVisible = false;
    },
    handleView(img) {
      this.dialogVisible = true;
      this.dialogImage = img;
    },
    handleCurrentChange(val) {
      this.queryInfo.pageNo = val;
      this.getShopList();
    },

  }
}
</script>

<style scoped>

</style>