<template>
  <div>
    <!-- 面包屑导航区域 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <router-link to="/welcome">首页</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>店铺管理</el-breadcrumb-item>
        <el-breadcrumb-item>店铺分类</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 分类列表区域 -->
      <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false"
                  show-index index-text="#" border class="tree-table">
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.level===1">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.level===2">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operation" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页条区域 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pageNo"
          :page-sizes="[3,5,10,15]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible" width="50%" @close="cascaderClose">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="分类名称" prop="cateName">
          <el-input v-model="form.cateName" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="catePid">
          <!-- 使用级联选择器进行分类展示 -->
          <el-cascader v-model="selectedKeys" :options="cascaderMenus"
                       clearable placeholder="请选择父级分类"
                       :props="cascaderProps"
                       @change="parentMenuChange"
                       :disabled="!isAdding">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "shopTypeList",
  data() {
    return {
      cateList: [
        {
          id: 1,
          name: "美食",
          pid: 0,
          level: 1,
          children: [
            {
              id: 2,
              name: "美食",
              pid: 1,
              level: 2,
            },
            {
              id: 3,
              name: "美食",
              pid: 1,
              level: 2,
            },
            {
              id: 4,
              name: "美食",
              pid: 1,
              level: 2,
            },

          ]
        }
      ],
      queryInfo: {
        pageNo: 1,
        pageSize: 5,
        maxLevel: 1
      },
      //总数据条数
      total: 0,
      //表格列配置
      columns: [
        {
          label: "分类名称",
          prop: "name",
          width: "200"
        },
        {
          label: "分类级别",
          prop: "level",
        },
        {
          label: "排序",
          prop: "cateLevel",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "operation",
          minWidth: 185
        }
      ],
      //表单数据
      form: {
        name: "",
        pid: 1,
        level: 1,
      },
      //表单验证规则
      rules: {
        name: [
          {required: true, message: "请输入分类名称", trigger: "blur"}
        ],
        pid: [
          {required: true, message: "请选择父级分类", trigger: "blur"}
        ]
      },
      //对话框是否显示
      dialogFormVisible: false,
      //当前是否处于添加状态
      isAdding: false,
      //级联选择器选中的父子节点
      selectedKeys: [],
      //级联选择器列表数据
      cascaderMenus: [],
      //级联选择器配置
      cascaderProps: {
        value: "id", //当前节点值
        label: "name", //当前节点显示的文本
        children: "children", //父子节点之间的关系
        expandTrigger: "hover",  // 何时触发展开
        checkStrictly: true  // 是否严格检查父子关系,即父菜单是否可以被选中
      }
    };
  },
  methods: {
    // 获取分类列表
    async getCateList() {
    },
    // 添加分类
    async handleAdd() {
      this.isAdding = true;
      this.dialogFormVisible = true;
      //获取分类一二级列表
    },
    // 编辑分类
    handleEdit(row) {
    },
    // 删除分类
    handleDelete(row) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(async () => {
          })
          .catch(() => {
            this.$message.info("已取消删除");
          });
    },
    // 级联选择器选择事件
    parentMenuChange() {
      if (this.selectedKeys.length === 0) {
        this.form.pid = 1;
        this.form.level = 1;
      } else {
        this.form.pid = this.selectedKeys[this.selectedKeys.length - 1];
        this.form.level = this.selectedKeys.length + 1;
      }
    },
    // 提交表单
    async handleSubmit() {
    },
    // 分页改变
    handleCurrentChange(val) {
      this.queryInfo.pageNo = val;
      this.getCateList();
    },
    // 每页条数改变
    handleSizeChange(val) {
      this.queryInfo.pageSize = val;
      this.getCateList();
    },
    cascaderClose() {
      this.selectedKeys = [];
      //移除form中的cateId，避免作为添加分类表单提交时出现错误
      delete this.form.id;
      this.form.name = "";
      this.form.pid = 1;
      this.form.level = 1;
      //清空验证信息
      this.$refs.form.clearValidate();

    },
  },
}
</script>

<style scoped>
.tree-table{
  margin-top: 15px;
}
</style>