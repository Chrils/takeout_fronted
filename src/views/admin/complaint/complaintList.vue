<template>
  <div>
    <!-- 面包屑导航区域 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <router-link to="/welcome">首页</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>投诉管理</el-breadcrumb-item>
        <el-breadcrumb-item>投诉列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-card>
      <el-row :gutter="10">
        <el-form ref="form" :model="form" label-width="80px" size="small">
          <el-col :span="8">
            <el-form-item label="投诉编号">
              <el-input v-model="form.complaintNo" placeholder="请输入投诉编号">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="投诉状态">
              <el-select v-model="form.complaintStatus" placeholder="请选择投诉状态">
                <el-option v-for="item in complaintStatus" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商家名称">
              <el-input v-model="form.shopName" placeholder="输入商家名称" style="width: 400px"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <el-table :data="tableData" border tooltip-effect="dark" style="width: 100%;">
        <el-table-column prop="complaintNo" label="投诉编号"></el-table-column>
        <el-table-column prop="shopName" label="商家名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="complaintStatus" label="投诉状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.complaintStatus == '1'">已处理</el-tag>
            <el-tag type="danger" v-else>未处理</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="complaintTime" label="投诉时间" width="180"></el-table-column>
        <el-table-column prop="complaintContent" label="投诉内容" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="complaintReply" label="投诉回复" width="180"></el-table-column>
        <el-table-column prop="complaintReplyTime" label="投诉回复时间" width="180"></el-table-column>
        <el-table-column prop="complaintReplyContent" label="投诉回复内容" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handle(scope.$index, scope.row)">处理</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="form.pageNo" :page-sizes="[5, 10, 20, 50, 100]"
                     :page-size="form.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="total"></el-pagination>
    </el-card>

    <!-- 处理投诉的对话框 -->
    <el-dialog title="处理投诉" :visible.sync="handleDialogVisible" width="30%">
      <el-form :model="handleForm" :rules="handleRules" ref="handleForm" label-width="80px" size="small">
        <!-- 选择驳回或者受理 -->
        <el-form-item label="操作" prop="handleType">
          <el-radio-group v-model="handleForm.handleType">
            <el-radio :label="1">驳回</el-radio>
            <el-radio :label="2">受理</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="投诉回复" prop="complaintReply">
          <el-input type="textarea" v-model="handleForm.complaintReply" placeholder="请输入投诉回复"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
export default {
  name: "complaintList",
  data() {
    return {
      form: {
        complaintNo: "",
        complaintStatus: "",
        shopName: "",
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      complaintStatus: [{
        label: "全部",
        value: ""
      }, {
        label: "待处理",
        value: "1"
      }, {
        label: "已处理",
        value: "2"
      }],
      tableData: [{
        complaintNo: "1",
        shopName: "商家1",
        complaintStatus: "1",
        complaintTime: "2019-01-01",
        complaintContent: "投诉内容1",
        complaintReply: "投诉回复1",
        complaintReplyTime: "2019-01-01",
        complaintReplyContent: "投诉回复内容1"
      }, {
        complaintNo: "2",
        shopName: "商家2",
        complaintStatus: "2",
        complaintTime: "2019-01-01",
        complaintContent: "投诉内容2",
        complaintReply: "投诉回复2",
        complaintReplyTime: "2019-01-01",
        complaintReplyContent: "投诉回复内容2"
      }],
      handleDialogVisible: false,
      handleForm: {
        complaintReply: "",
        handleType: 1
      },
      handleRules: {
        complaintReply: [{
          required: true,
          message: "请输入投诉回复",
          trigger: "blur"
        }]
      }
    };
  },
  methods: {
    search() {
      this.form.pageNo = 1;
      this.getList();
    },
    getList(){},
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.form.pageNo = val;
      this.getList();
    },
    handle(index, row) {
      this.handleDialogVisible = true;
    },
    handleSubmit() {
      this.$refs.handleForm.validate((valid) => {
        if (valid) {
          this.$message({
            message: "提交成功",
            type: "success"
          });
          this.handleDialogVisible = false;
        }
      });
    }
  },
}
</script>

<style scoped>

</style>