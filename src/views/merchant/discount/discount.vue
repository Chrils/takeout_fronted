<template>
  <div>
    <!-- 面包屑导航区域 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>用户</el-breadcrumb-item>
        <el-breadcrumb-item>折扣管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-card>
      <div slot="header">
        <el-button type="primary" @click="addDiscount">新增折扣</el-button>
        <el-button type="primary" @click="handleAdd">新增优惠券</el-button>
      </div>
      <div class="discount-list">
        <div class="discount-container">
          <p class="discount-title">
            满减信息
          </p>
          <div class="discount-content">
            <div class="discount-full-item">
              <p>
                <span>满 10 元减 5 元</span>
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDiscount"></el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteDiscount"></el-button>
              </p>
              <br/>
              <p>
                <span>满 10 元减 5 元</span>
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDiscount"></el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteDiscount"></el-button>
              </p>
              <br/>
              <p>
                <span>满 10 元减 5 元</span>
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDiscount"></el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteDiscount"></el-button>
              </p>
              <br/>

              <p><i class="el-icon-plus"></i></p>
            </div>
          </div>
        </div>
        <div style="width: 100%">
          <p class="discount-title">优惠券信息</p>
          <el-row :gutter="20">
            <el-col :span="4">
              <el-select :value="queryInfo.voucherTimeLimit" placeholder="过期时间">
                <el-option label="全部" value=""></el-option>
                <el-option label="无限制" :value="0"></el-option>
                <el-option label="有过期时间" :value="1"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-input v-model="queryInfo.voucherId" placeholder="请输入优惠券编号">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
              </el-input>
            </el-col>
            <el-col :span="3">
              <el-switch v-model="queryInfo.voucherStatus" active-value="1" inactive-value="0" active-text="只看可用券"></el-switch>
            </el-col>
          </el-row>

          <el-table :data="tableData" border tooltip-effect="dark">
            <el-table-column label="优惠券编号" prop="voucherId"></el-table-column>
            <el-table-column label="优惠券名称" prop="voucherName" width="180" show-overflow-tooltip></el-table-column>
            <el-table-column label="优惠券起用金额" prop="voucherMinAmount"></el-table-column>
            <el-table-column label="优惠券面额" prop="voucherAmount"></el-table-column>
            <el-table-column label="优惠券有效期" prop="voucherStartTime" width="170">
              <template slot-scope="scope">
                <template v-if="scope.row.voucherTimeLimit == 0">无限制</template>
                <template v-else>
                  <span>{{ scope.row.voucherStartTime }}</span>
                  <span>至</span>
                  <span>{{ scope.row.voucherEndTime }}</span>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="优惠券状态" prop="voucherStatus" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.voucherStatus == 2">已发布</span>
                <span v-else-if="scope.row.voucherStatus == 1">可用</span>
                <span v-else>不可用</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <el-button type="warning" icon="el-icon-upload2" v-if="scope.row.voucherStatus != 2" :disabled="scope.row.voucherStatus == 0" size="mini"
                           @click="handlePublish(scope.row)">发布
                </el-button>
                <el-button type="warning" icon="el-icon-upload2" v-else="scope.row.voucherStatus == 2" size="mini"
                           @click="handleCancelPublish(scope.row)">取消发布
                </el-button>
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="queryInfo.pageNo" :page-sizes="[5, 10, 20, 50, 100]"
                         :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
                         :total="total">
          </el-pagination>
        </div>
      </div>
    </el-card>

    <el-dialog title="新增折扣" :visible.sync="discountDialogVisible" width="30%">
      <div>
        满
        <el-input v-model="discountForm.startAmount"></el-input>
        减
        <el-input v-model="discountForm.discountAmount"></el-input>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 新增优惠券对话框 -->
    <el-dialog title="新增优惠券" :visible.sync="dialogVisible" width="60%">
      <el-form :model="form" :rules="rules" ref="form" label-width="130px">
        <el-form-item label="优惠券名称" prop="voucherName">
          <el-input v-model="form.voucherName" placeholder="请输入优惠券名称"></el-input>
        </el-form-item>
        <el-form-item label="优惠券起用类型" prop="voucherAmountLimit">
          <el-radio-group v-model="form.voucherAmountLimit">
            <el-radio :label="0">无门槛</el-radio>
            <el-radio :label="1">设置起用金额</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.voucherAmountLimit == 1" label="优惠券起用金额" prop="voucherMinAmount">
          <el-input v-model="form.voucherMinAmount" placeholder="请输入优惠券起用金额"></el-input>
        </el-form-item>
        <el-form-item label="优惠券面额" prop="voucherAmount">
          <el-input v-model="form.voucherAmount" placeholder="请输入优惠券面额"></el-input>
        </el-form-item>
        <el-form-item label="优惠券有效期" prop="voucherTimeLimit">
          <el-radio-group v-model="form.voucherTimeLimit">
            <el-radio label="0">无限制</el-radio>
            <el-radio label="1">设置有效期</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="优惠券有效期" prop="voucherStartTime" v-if="form.voucherTimeLimit == 1">
          <el-date-picker v-model="form.voucherStartTime" type="date" placeholder="请选择优惠券有效期开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="优惠券有效期" prop="voucherEndTime" v-if="form.voucherTimeLimit == 1">
          <el-date-picker v-model="form.voucherEndTime" type="date" placeholder="请选择优惠券有效期结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="优惠券说明" prop="voucherDesc">
          <el-input v-model="form.voucherDesc" placeholder="请输入优惠券说明"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit('add')" :loading="btnLoading">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
export default {
  name: "discount",
  data() {
    return {
      discountDialogVisible: false,
      dialogVisible: false,
      discountForm: {
        startAmount: '',
        discountAmount: ''
      },
      queryInfo: {
        voucherId: '',
        voucherStatus: 0,
        pageNo: 1,
        pageSize: 10,
        voucherType: '',
        voucherTimeLimit: '',
        voucherAmountLimit: '',
      },
      tableData: [
        {
          voucherId: '1',
          voucherName: '优惠券名称',
          voucherType: 0,
          voucherMinAmount: '100',
          voucherAmount: '100',
          voucherStartTime: '2018-01-01 00:00:00',
          voucherEndTime: '2018-01-01 00:00:00',
          voucherStatus: 1,
          voucherTimeLimit: 0,
        },
        {
          voucherId: '2',
          voucherName: '优惠券名称',
          voucherType: 1,
          voucherMinAmount: '100',
          voucherAmount: '100',
          voucherStartTime: '2018-01-01 00:00:00',
          voucherEndTime: '2018-01-01 00:00:00',
          voucherStatus: 0,
        },
        {
          voucherId: '3',
          voucherName: '优惠券名称',
          voucherType: 2,
          voucherMinAmount: '100',
          voucherAmount: '100',
          voucherStartTime: '2018-01-01 00:00:00',
          voucherEndTime: '2018-01-01 00:00:00',
          voucherStatus: 2,
        },
      ],
      total: 0,
      btnLoading: false,
      rules: {
        voucherId: [
          { required: true, message: '请输入优惠券编号', trigger: 'blur' },
        ],
        voucherName: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' },
        ],
        voucherType: [
          { required: true, message: '请选择优惠券类型', trigger: 'blur' },
        ],
        voucherMinAmount: [
          { required: true, message: '请输入优惠券起用金额', trigger: 'blur' },
        ],
        voucherAmount: [
          { required: true, message: '请输入优惠券面额', trigger: 'blur' },
        ],
        voucherTimeLimit: [
          { required: true, message: '请选择优惠券有效期', trigger: 'blur' },
        ],
        voucherStartTime: [
          { required: true, message: '请选择优惠券有效期开始时间', trigger: 'blur' },
        ],
        voucherEndTime: [
          { required: true, message: '请选择优惠券有效期结束时间', trigger: 'blur' },
        ],
        voucherDesc: [
          { required: true, message: '请输入优惠券说明', trigger: 'blur' },
        ],
        areaId: [
          { required: true, message: '请选择优惠券适用区域', trigger: 'blur' },
        ],
      },
      form: {
        voucherId: '',
        voucherStatus: 0,
        pageNo: 1,
        pageSize: 10,
        voucherType: '',
        voucherTimeLimit: '',
        voucherAmountLimit: '',
        areaId: '',
      },

    }
  },
  methods: {
    addDiscount() {
      this.discountDialogVisible = true;
    },
    editDiscount() {
      this.discountDialogVisible = true;
    },
    handleAdd() {
      this.form = {
        voucherId: '',
        voucherName: '',
        voucherType: '',
        voucherMinAmount: '',
        voucherAmount: '',
        voucherStartTime: '',
        voucherEndTime: '',
        voucherDesc: '',
      };
      this.dialogVisible = true;
    },
    deleteDiscount() {
      this.$confirm('确定删除该折扣吗？', '提示', {
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
    search() {
      this.queryInfo.pageNo = 1;
      this.getList();
    },
    handlePublish(row) {
      this.$confirm('此操作将发布该优惠券, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '发布成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发布'
        });
      });
    },
    handleCancelPublish(row) {
      this.$confirm('此操作将取消发布该优惠券, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '取消发布成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发布'
        });
      });
    },
    handleSizeChange(val) {
      this.queryInfo.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pageNo = val;
      this.getList();
    },

  }
}
</script>

<style scoped lang="less">
.discount-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .discount-container {
    margin-top: 20px;
    width: 50%;

    > .discount-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    > .discount-content {
      > .discount-full-item {
        margin-bottom: 20px;

        > p {
          margin-bottom: 0;

          > span {
            font-size: 14px;
            font-weight: bold;
            margin-right: 18px;
          }
        }

        > i {
          font-size: 20px;
          color: #409EFF;
          cursor: pointer;
        }
      }
    }
  }
}

.discount-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>