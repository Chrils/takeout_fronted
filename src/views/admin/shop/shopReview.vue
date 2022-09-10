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
        <el-table-column label="店铺名称" prop="name" width="180"></el-table-column>
        <el-table-column label="店铺地址" prop="detailAddress" width="180" show-overflow-tooltip></el-table-column>
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
            <el-tag type="info"  v-if="scope.row.idCardStat === 0">认证中</el-tag>
            <el-tag type="success" v-else-if="scope.row.idCardStat === 1">已通过</el-tag>
            <el-tag type="danger" v-else>未通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" :disabled="scope.row.idCardStat !== 1" @click="handleReview(scope.row)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页条 -->
      <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :current-page.sync="queryInfo.pageNo"
          :page-sizes="[5,10,15,20]"
          :page-size="queryInfo.pageSize">
      </el-pagination>

    </el-card>

    <el-dialog title="查看图片" :visible.sync="dialogVisible" width="30%">
      <img :src="dialogImage" alt="" style="width: 80%">
    </el-dialog>

    <!-- 审核对话框 -->
    <el-dialog title="审核" :visible.sync="reviewVisible" width="30%">
      <el-form :model="reviewForm" label-width="80px" :rules="reviewFormRules" ref="reviewForm">
        <el-form-item label="审核结果" prop="reviewStat">
          <el-radio-group v-model="reviewForm.reviewStat">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见" prop="reviewMsg">
          <el-input :disabled="reviewForm.reviewStat===1" type="textarea" v-model="reviewForm.reviewMsg" placeholder="请输入审核意见"></el-input>
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
      shopList: [],
      queryInfo: {
        pageNo: 1,
        pageSize: 5,
      },
      dialogVisible: false,
      dialogImage: "",
      reviewVisible: false,
      reviewForm: {
        id: "",
        reviewStat: 1,
        reviewMsg: ""
      },
      total: 0,
      reviewFormRules: {
        reviewStat: [
          { required: true, message: "请选择审核结果", trigger: "change" }
        ]
      }

    }
  },
  methods:{
    handleReview(row) {
      this.reviewForm.id = row.id;
      this.reviewVisible = true;
    },
    async handleReviewSubmit() {
      await this.$refs.reviewForm.validate(async (valid) => {
        if (valid) {
          let appendStr = "none";
          if (this.reviewForm.reviewStat === 2) {
            appendStr = this.reviewForm.reviewMsg;
          }
          const {data:res} = await this.$http.put(`/consumer/admin/shop/review/${this.reviewForm.id}/${this.reviewForm.reviewStat}/${appendStr}`)
          if (res.meta.status!=="200") return this.$message.error(res.meta.msg);
          this.$message.success("审核成功");
          this.reviewVisible = false;
          await this.getApplyShopList();
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
      this.getApplyShopList();
    },
    handleSizeChange(val) {
      this.queryInfo.pageSize = val;
      this.getApplyShopList();
    },
    async getApplyShopList(){
      const {data:res} = await this.$http.get(`/consumer/admin/shop/apply/list/${this.queryInfo.pageNo}/${this.queryInfo.pageSize}`);
      if (res.meta.status !== "200") return this.$message.error(res.meta.msg);
      this.shopList = res.data.data.records;
      this.total = res.data.data.total;
    }

  },
  created() {
    this.getApplyShopList();
  }
}
</script>

<style scoped>

</style>