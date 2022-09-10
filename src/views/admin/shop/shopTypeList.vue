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
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input placeholder="输入类别名称" v-model="queryInfo.name" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchShopTypeList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 分类列表区域 -->
      <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false"
                  show-index index-text="#" border class="tree-table">
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
          :page-sizes="[3,5,10,16]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible" width="50%" :close-on-click-modal="false" @close="handleClose">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="分类图标" prop="icon">
          <el-upload
              class="upload-demo"
              list-type="picture"
              action=""
              :headers="headers"
              :on-remove="handleRemovePic"
              :before-upload="beforeUpload"
              :http-request="uploadIcon"
              :limit="1"
              :on-exceed="overLimit"
              :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
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
      cateList: [],
      queryInfo: {
        name: '',
        pageNo: 1,
        pageSize: 5,
      },
      //总数据条数
      total: 0,
      //表格列配置
      columns: [
        {
          label: "分类名称",
          prop: "name",
          minWidth: 200
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
        id: '',
        name: "",
        icon:""
      },
      //表单验证规则
      rules: {
        name: [
          {required: true, message: "请输入分类名称", trigger: "blur"}
        ],
        icon: [
          {required: true, message: "请上传分类图标", trigger: "blur"}
        ]
      },
      //对话框是否显示
      dialogFormVisible: false,
      //当前是否处于添加状态
      isAdding: false,
      fileList: [], // 图片上传列表
      headers:{
        'Authorization': window.sessionStorage.getItem('token')
      },

    };
  },
  methods: {
    async handleRemovePic(file, fileList) {
      console.log(file, fileList);
      //删除fileList中的图片
      this.fileList.splice(0, 1);
      console.log("filelist", fileList);
      const {data:res} = await this.$http.delete("/file/delete?file="+file.uid)
      if(res.meta.status !== "200") return this.$message.error(res.meta.msg)
      this.form.icon = "";
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isGIF = file.type === 'image/gif';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG && !isGIF) {
        this.$message.error('上传图片只能是 JPG/PNG/GIF 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return (isJPG || isPNG || isGIF) && isLt2M;
    },
    async uploadIcon(param){
      const formData = new FormData();
      formData.append('file', param.file);
      const {data:res} = await this.$http.post("/file/upload",formData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if(res.meta.status!=="200") return this.$message.error(res.meta.msg);
      console.log(res);
      this.fileList.push({
        url: res.data.data,
        uid: res.data.data
      });
      this.form.icon = res.data.data
      this.$notify({
        title: "",
        message: "上传成功",
        type: "success"
      });
    },
    searchShopTypeList() {
      this.queryInfo.pageNo = 1;
      this.getCateList();
    },
    overLimit(){
      this.$notify.warning("仅可上传一张图片")
    },
    // 获取分类列表
    async getCateList() {
      const {data:res} = await this.$http.post(`/consumer/client/shop-type/list`,this.queryInfo);
      if (res.meta.status !== "200") return this.$message.error(res.meta.msg)
      this.cateList = res.data.data.records;
      this.total = res.data.data.total;
    },
    handleClose(){
      this.fileList = []
    },
    // 添加分类
    async handleAdd() {
      this.isAdding = true;
      this.form = {
        id: '',
        name: "",
        icon:""
      };
      this.dialogFormVisible = true;
    },
    // 编辑分类
    handleEdit(row) {
      this.isAdding = false;
      this.form = row;
      if (row.icon){
        this.fileList.push({
          url:row.icon,
          uid:row.icon
        })
      }
      this.dialogFormVisible = true;
    },
    // 删除分类
    handleDelete(row) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(async () => {
        const {data:res} = await this.$http.delete(`/consumer/client/shop-type/delete/${row.id}`);
        if (res.meta.status !== "200") return this.$message.error(res.meta.msg)
        this.$message.success("删除成功!");
        await this.getCateList();
      })
      .catch(() => {
        this.$message.info("已取消删除");
      });
    },
    // 提交表单
    async handleSubmit() {
      await this.$refs.form.validate(async valid => {
        if (!valid) return;
        const url = this.isAdding ? "/consumer/client/shop-type/add" : "/consumer/client/shop-type/edit";
        const params = Object.assign({}, this.form);
        if (this.isAdding) {
          const {data: res} = await this.$http.post(url, params);
          if (res.meta.status !== "200") return this.$message.error(res.meta.msg);
          this.$message.success("添加成功");
        }else{
          const {data: res} = await this.$http.put(url, params);
          if (res.meta.status !== "200") return this.$message.error(res.meta.msg);
          this.$message.success("修改成功");
        }
        this.dialogFormVisible = false;
        await this.getCateList();
      });
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
  },
  created() {
    this.getCateList();
  }
}
</script>

<style scoped>
.tree-table{
  margin-top: 15px;
}
/deep/.el-upload-list__item.is-ready {
  display: none;
}
</style>