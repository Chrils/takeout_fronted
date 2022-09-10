<template>
<div>
  <!-- 面包屑导航区域 -->
  <div class="breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>店铺信息修改</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <el-card>

    <!-- 消息提示区域 -->
    <el-alert
        title="店铺信息修改"
        type="info"
        center
        :closable="false"
        show-icon>
    </el-alert>

    <el-steps :active="active - 0" align-center finish-status="success" :space="300">
      <el-step title="基本信息" description="基本信息修改"></el-step>
      <el-step title="费用信息" description="费用信息修改"></el-step>
      <el-step title="门店地址" description="门店地址修改"></el-step>
      <el-step title="店铺logo" description="上传店铺logo"></el-step>
      <el-step title="完成" description="已完成"></el-step>
    </el-steps>

    <!-- 左侧tab栏区域 -->
    <el-form :model="form" :rules="rules" ref="form" label-width="150px" >
      <el-tabs v-model="active" tab-position="left">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="店铺名称" prop="name">
            <el-input :value="form.name" disabled style="width: 300px;" placeholder="请输入店铺名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="营业时间（0~23）" prop="name">
            <template v-for="(item,index) in workTimeArr">
              <el-row>
                <el-input v-model="item[0]" style="width: 200px;" placeholder="输入营业开始时间" @change="checkTimeFormat(item)"></el-input> -
                <el-input v-model="item[1]" style="width: 200px;" placeholder="输入营业结束时间" @change="checkTimeFormat(item)" ></el-input>
                <el-button type="danger" icon="el-icon-close" size="mini" circle @click="delWorkTimeItem(index)"></el-button>
              </el-row>
            </template>
            <el-button type="plain" icon="el-icon-plus" @click="addWorkTime"></el-button>
          </el-form-item>
          <el-form-item label="店铺分类" prop="shopType">
            <el-select v-model="form.shopType" placeholder="请选择">
              <el-option v-for="item in cateList" :label="item.name" :key="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="店铺公告" prop="name">
            <el-input type="textarea" v-model="form.notice" style="width: 600px;" placeholder="请输入店铺公告" clearable></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="配送信息" name="1">
          <el-form-item label="起送费用" prop="startingAmount">
            <el-input v-model="form.startingAmount" style="width: 300px;" placeholder="请输入起送金额" clearable></el-input>
          </el-form-item>
          <el-form-item label="配送费用" prop="deliveryAmount">
            <el-input v-model="form.deliveryAmount" style="width: 300px;" placeholder="请输入配送金额" clearable></el-input>
          </el-form-item>
          <el-form-item label="最大配送时间" prop="maxDeliveryTime">
            <el-input v-model="form.maxDeliveryTime" style="width: 300px;" placeholder="请输入最大配送时间" clearable></el-input>
          </el-form-item>
          <el-form-item label="配送范围" prop="deliveryRange">
            <el-input type="textarea" v-model="form.deliveryRange" style="width: 300px;" placeholder="请输入配送范围" clearable></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="门店地址" name="2">
          <AMap :map-obj="mapObj" style="height: 400px"></AMap>
        </el-tab-pane>
        <el-tab-pane label="店铺logo" name="3">
          <el-form-item label="店铺logo">
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
                :limit="1"
                :on-exceed="overLimit"
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
  name: "editProfile",
  components: {AMap},
  data(){
    return {
      //营业时间段的数组
      shopId:localStorage.getItem('shopId'),
      workTimeArr:[],
      active: '0',
      // 商品图片上传headers信息
      headers:{
        'Authorization': window.sessionStorage.getItem('token')
      },
      form:{
        name: '',
        shopType: [],
        notice: '',
        startingAmount: '',
        deliveryAmount: '',
        deliveryRange: '',
        workTimeStart: '',
        workTimeEnd: '',
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
      mapObj:{
        center: [],
        address: "",
        searchKey: "",
        province: "",
        city: "",
        area: ""
      }
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
    async handleRemove(file, fileList) {
      console.log(file, fileList);
      //删除fileList中的图片
      this.fileList.splice(0, 1);
      console.log("filelist", fileList);
      const {data:res} = await this.$http.delete("/file/delete?file="+file.path)
      if(res.meta.status !== "200") return this.$message.error(res.meta.msg)
      this.form.img = "";
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
      this.form.img = res.data.data
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
      //检查时间段是否有重叠
      if (this.checkTime()) {
        this.active = 0;
        return;
      }
      this.form.longitude = this.mapObj.center[0];
      this.form.latitude = this.mapObj.center[1];
      this.form.province = this.mapObj.province;
      this.form.city = this.mapObj.city;
      this.form.area = this.mapObj.area;
      this.form.detailAddress = this.mapObj.address;
      let str = '';
      for (let arr of this.workTimeArr) {
        str += (arr.join('-')+',')
      }
      // 去除最后一个逗号
      str = str.substring(0, str.length - 1);
      console.log(str)
      this.form.workTime = str
      this.$refs.form.validate(async valid => {
        if (valid) {
          const {data:res} = await this.$http.put("/consumer/admin/shop/profile/edit",this.form)
          if(res.meta.status!=="200") return this.$message.error(res.meta.msg);
          this.$message.success("修改成功");
          await this.$router.push("/merchant/profile")
        } else {
          return false;
        }
      });
    },
    async getShopDetail(){
      const {data:res} = await this.$http.get(`/consumer/admin/shop/detail/${this.shopId}`);
      if(res.meta.status !== "200") return this.$message.error(res.meta.msg);
      this.form = res.data.data;
      let workTimeArr = [];
      let workTimeRangeArr = this.form.workTime.split(',')
      for (let item of workTimeRangeArr) {
        workTimeArr.push(item.split('-'))
      }
      this.workTimeArr = workTimeArr
      this.mapObj = {
        center: [this.form.longitude,this.form.latitude],
        address: this.form.address,
        searchKey: this.form.address,
        province: this.form.province,
        city: this.form.city,
        area: this.form.area,
      }
      if (this.form.img){
        this.fileList.push({
          url: this.form.img,
          uid: this.form.img
        })
      }
    },
    async getCateList(){
      const {data:res} = await this.$http.get("/consumer/client/shop-type/list/without-page")
      if (res.meta.status !== "200") return this.$message.error(res.meta.msg)
      this.cateList = res.data.data;
    },
    addWorkTime(){
      this.workTimeArr.push([0,23])
    },
    delWorkTimeItem(index){
      if (this.workTimeArr.length === 1) return this.$message.warning("至少保留一个时间段")
      this.workTimeArr.splice(index,1)
    },
    checkTime(){
      let flag = false;
      for (let i = 0; i < this.workTimeArr.length; i++) {
        for (let j = i + 1; j < this.workTimeArr.length; j++) {
          if (this.workTimeArr[i][0] <= this.workTimeArr[j][0] && this.workTimeArr[i][1] >= this.workTimeArr[j][0]) {
            flag = true;
            break;
          }
        }
        if (flag) break;
      }
      if (flag) {
        this.$message.warning("时间段不能重叠")
      }
      return flag;
    },
    checkTimeFormat(item){
      //校验是否是数字
      if (!/^[0-9]*$/.test(item[0]) || !/^[0-9]*$/.test(item[1])) {
        item.splice(0,2,0,23)
        this.$message.warning("请输入正确的时间段")
        return false;
      }
      //校验是否是0~23的整数
      if (item[0] < 0 || item[0] > 23 || item[1] < 0 || item[1] > 23) {
        this.$message.warning("请输入0~23的整数")
        item.splice(0,2,0,23)
        return false;
      }
      //校验是否是正序
      if (item[0] >= item[1]) {
        item.splice(0,2,0,23)
        this.$message.warning("开始时间不能大于等于结束时间")
        return false;
      }
    },
    overLimit(){
      this.$notify.warning("仅可上传一张图片")
    }
  },
  created() {
    this.getCateList();
    this.getShopDetail();
  }
}
</script>

<style scoped>
.btnAdd{
  margin-top: 15px;
}
</style>