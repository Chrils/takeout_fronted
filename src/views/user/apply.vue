<template>
  <div>
    <!-- 面包屑导航区域 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>用户</el-breadcrumb-item>
        <el-breadcrumb-item>店铺注册</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 消息提示区域 -->
      <el-alert
          title="店铺信息注册"
          type="info"
          center
          :closable="false"
          show-icon>
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps :active="active - 0" align-center finish-status="success" :space="300">
        <el-step title="基本信息" description="填写基本信息"></el-step>
        <el-step title="门店地址" description="填写门店地址"></el-step>
        <el-step title="身份认证" description="上传身份证"></el-step>
        <el-step title="资格认证" description="上传开店凭证"></el-step>
        <el-step title="完成" description="已完成，等待审批"></el-step>
      </el-steps>

      <!-- 左侧tab栏区域 -->
      <el-form :model="form" :rules="rules" ref="form" label-width="120px" >
        <el-tabs v-model="active" tab-position="left">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="店铺名称" prop="name">
              <el-input v-model="form.name" style="width: 300px;" placeholder="请输入店铺名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="店铺分类" prop="shopType">
              <el-cascader
                  v-model="form.shopType"
                  :options="cateList"
                  :props="cascaderProps"
                  placeholder="请选择分类">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="门店地址" name="1">
            <AMap style="height: 400px"></AMap>
          </el-tab-pane>
          <el-tab-pane label="身份认证" name="2">
            <el-form-item label="身份证（正面）">
              <!-- 图片上传 -->
              <el-upload
                  class="upload-demo"
                  list-type="picture-card"
                  action=""
                  :headers="headers"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :before-upload="beforeUpload"
                  :on-success="handleSuccess"
                  :on-error="handleError"
                  :http-request="upload"
                  :file-list="fileList">
                <i class="el-icon-plus"></i>
              </el-upload>
              <!-- 图片预览 -->
              <el-dialog
                  title="预览" append-to-body
                  :visible.sync="dialogImageVisible" width="30%">
                <img width="100%" :src="dialogImageUrl" alt=""
                     crossOrigin="use-credentials">
              </el-dialog>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="资格认证" name="3">
            <el-form-item label="营业执照">
              <!-- 图片上传 -->
              <el-upload
                  class="upload-demo"
                  list-type="picture-card"
                  action=""
                  :headers="headers"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :before-upload="beforeUpload"
                  :on-success="handleSuccess"
                  :on-error="handleError"
                  :http-request="upload"
                  :file-list="fileList">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-button type="primary" class="btnAdd" @click="handleSubmit">提交</el-button>
              <!-- 图片预览 -->
              <el-dialog
                  title="预览" append-to-body
                  :visible.sync="dialogImageVisible" width="30%">
                <img width="100%" :src="dialogImageUrl" alt=""
                     crossOrigin="use-credentials">
              </el-dialog>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>

    </el-card>
  </div>
</template>

<script>

import AMap from "@/components/common/AMap";

export default {
  name: "apply",
  components: {AMap},
  data(){
    return{
      active: '0',
      // 商品图片上传headers信息
      headers:{
        'Authorization': window.sessionStorage.getItem('token')
      },
      form:{
        name: '',
        shopType: [],
        img:"",
        idCard: "",
        license: "",
      },
      mapDialogVisible: false,
      rules:{
        name: [
          { required: true, message: '请输入店铺名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        shopType: [
          { required: true, message: '请选择店铺分类', trigger: 'change' }
        ],
        idCard: [
          { required: true, message: '请上传身份证', trigger: 'change' }
        ],
        license: [
          { required: true, message: '请上传营业执照', trigger: 'change' }
        ],
      },
      dialogImageUrl: "", // 图片预览url
      dialogImageVisible: false, // 图片预览对话框是否显示
      fileList: [], // 图片上传列表
      cateList: [], // 商品分类列表
      // 级联选择器配置
      cascaderProps: {
        value: "id", //当前节点值
        label: "name", //当前节点显示的文本
        children: "children", //父子节点之间的关系
        expandTrigger: "hover",  // 何时触发展开
      },
    }
  },
  methods:{
    handleClick(index) {
      this.active = index
    },
    handlePreview(file){
      this.dialogImageUrl = file.url;
      this.dialogImageVisible = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.form.img.splice(index, 1);
      //删除fileList中的图片
      this.fileList.splice(index, 1);
      console.log("filelist", fileList);
    },
    handleSuccess(res, file, fileList) {
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
    async upload(param){
      this.$notify({
        title: "",
        message: "上传成功",
        type: "success"
      });
    },
    handleError(err, file, fileList) {
      console.log(err, file, fileList);
    },
    handleSubmit(){

    }
  }
}
</script>

<style scoped>
/deep/.el-upload-list__item.is-ready {
  display: none;
}
.btnAdd{
  margin-top: 15px;
}
.el-card{
  height: 80vh;
}
</style>