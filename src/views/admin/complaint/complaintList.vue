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
              <el-input v-model="form.id" placeholder="请输入投诉编号">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="投诉状态">
              <el-select v-model="form.complaintState" placeholder="请选择投诉状态">
                <el-option v-for="item in complaintState" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商家名称">
              <el-input v-model="form.username" placeholder="输入商家名称" style="width: 400px"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <el-table :data="tableData" border tooltip-effect="dark" style="width: 100%;">
        <el-table-column prop="id" label="投诉编号"></el-table-column>
        <el-table-column prop="username" label="商家名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="complaintStatus" label="投诉状态">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.complaintState == '0'">处理中</el-tag>
            <el-tag v-else-if="scope.row.complaintState == '1'">审核中</el-tag>
            <el-tag type="success" v-else-if="scope.row.complaintState == '2'">已受理</el-tag>
            <el-tag type="danger" v-else>已驳回</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="投诉时间" width="180"></el-table-column>
        <el-table-column prop="content" label="投诉内容" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="complaintType" label="投诉类型" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.complaintType==1">资质问题</span>
            <span v-else-if="scope.row.complaintType==2">违规商品</span>
            <span v-else-if="scope.row.complaintType==3">品牌侵权</span>
            <span v-else>其他</span>
          </template>
          s
        </el-table-column>
        <el-table-column prop="sellerAddContent" label="商家补充内容" width="180"></el-table-column>
        <el-table-column prop="handleTime" label="投诉截至时间" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.complaintState!=1" type="primary" size="mini"
                       @click="handle(scope.$index, scope.row)">处理
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="form.pageNum" :page-sizes="[5, 10, 20, 50, 100]"
                     :page-size="form.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="total"></el-pagination>
    </el-card>
    <!-- 处理投诉的对话框 -->
    <el-dialog title="处理投诉" :visible.sync="handleDialogVisible" width="30%">
      <el-form :model="handleForm" :rules="handleRules" ref="handleForm" label-width="80px" size="small">
        <!-- 选择驳回或者受理 -->
        <el-form-item label="操作" prop="handleType">
          <el-radio-group v-model="handleForm.complaintState">
            <el-radio :label="2">受理</el-radio>
            <el-radio :label="3">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateComplaint">确 定</el-button>
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
        id: '',
        username: '',
        complaintState: '1',
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      //状态列表集合
      complaintState: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "处理中",
          value: "0"
        },
        {
          label: "审核中",
          value: "1"
        },
        {
          label: "已受理",
          value: "2"
        },
        {
          label: "已驳回",
          value: "3"
        }],
      tableData: [],
      handleDialogVisible: false,
      handleForm: {
        id: '',
        complaintState: ''
      },
      handleRules: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //按条件查找
    search() {
      this.form.pageNum = 1;
      this.getList();
    },
    //默认查询列表
    async getList() {
      const {data: res} = await this.$http.get("ym/getComplaintList", {params: this.form});
      console.log(res)
      if (res.meta.status !== "200") return this.$message.error(res.meta.msg)
      this.tableData = res.data.data.list
      this.total = res.data.data.total
    },
    //改变页容量
    handleSizeChange(val) {
      this.form.pageSize = val;
      console.log("pageSize: " + val)
      this.getList();
    },
    //改变页码
    handleCurrentChange(val) {
      this.form.pageNum = val;
      console.log("pageNum: " + val)
      this.getList();
    },
    //是否展示办理框
    handle(index, row) {
      this.handleForm.id = row.id;
      this.handleDialogVisible = true;
    },
    //管理员修改投诉单状态
    async updateComplaint() {
      const {data: res} = await this.$http.get("ym/updateComplaint", {params: this.handleForm});
      console.log(res)
      if (res.meta.status === "200") {
        this.$message({
          message: "提交成功",
          type: "success"
        });
        this.handleDialogVisible = false;
        this.getList();
      }

    }
  }
}
</script>

<style scoped>

</style>