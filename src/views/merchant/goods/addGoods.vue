<template>
  <div>
    <!-- 面包屑导航区域 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <router-link to="/welcome">首页</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>
          <router-link to="/merchant/goods/list">商品列表</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>新品上架</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-card>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px" size="small">
        <el-form-item label="商品名称">
          <el-input v-model="form.goodsName" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品类型">
          <el-select v-model="form.goodsTypeId" placeholder="请选择商品类型">
            <el-option v-for="item in goodsType" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="form.goodsPrice" placeholder="请输入商品价格" style="width: 206px"></el-input>
        </el-form-item>
        <el-form-item label="打包费用">
          <el-input v-model="form.goodsPackageFee" placeholder="请输入打包费用" style="width: 206px"></el-input>
        </el-form-item>
        <el-form-item label="商品规格参数">
          <el-radio-group v-model="goodsDynamicParam">
            <el-radio :label="1">默认（无）</el-radio>
            <el-radio :label="0">添加规格参数</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="goodsDynamicParam === 0">
          <el-table :data="form.dynamicParamList" border style="width: 100%;">
            <el-table-column label="参数名称" prop="paramName" width="200">
              <template v-slot="scope">
                <el-input v-model="scope.row.paramName" placeholder="请输入参数名称"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="参数值" prop="paramValue">
              <template v-slot="props">
                <el-tag v-for="(item,index) in props.row.paramValue" :key="index" closable
                        @close="tagClosed(index,props.row)">{{ item }}
                </el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="props.row.inputVisible"
                    v-model="props.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(props.row)"
                    @blur="handleInputConfirm(props.row)"
                    @keydown.esc="handleInputConfirm(props.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(props.row)">+ New Params
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleDynamicAdd">添加</el-button>
                <el-button size="mini" type="danger" @click="handleDynamicRemove(scope.$index)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="商品详情属性">
          <el-radio-group v-model="goodsStaticParam">
            <el-radio :label="1">默认（无）</el-radio>
            <el-radio :label="0">添加详情属性</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="goodsStaticParam === 0">
          <el-table :data="form.staticParamList" border style="width: 100%;">
            <el-table-column label="参数名称" prop="paramName" width="200">
              <template v-slot="scope">
                <el-input v-model="scope.row.paramName" placeholder="请输入参数名称"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="参数值" prop="paramName">
              <template v-slot="scope">
                <el-input v-model="scope.row.paramValue" placeholder="请输入参数值"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleStaticAdd">添加</el-button>
                <el-button size="mini" type="danger" @click="handleStaticRemove(scope.$index)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item label="商品图片">
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
        <el-form-item label="商品详情">
          <el-input type="textarea" v-model="form.goodsDesc" placeholder="请输入商品描述"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "addGoods",
  data() {
    return {
      form: {
        goodsName: '',
        goodsTypeId: '',
        goodsPrice: '',
        goodsImgs: [], // 商品图片
        goodsDesc: '',
        goodsPackageFee: 0,
        dynamicParamList: [
          {
            paramName: '',
            paramValue: []
          }
        ],
        staticParamList: [
          {
            paramName: '',
            paramValue: []
          }
        ]
      },
      goodsDynamicParam: 1, // 商品动态参数
      goodsStaticParam: 1, // 商品静态属性
      goodsType: [
        {
          value: '1',
          label: '类型一'
        },
        {
          value: '2',
          label: '类型二'
        }
      ],
      rules: {
        goodsName: [
          {required: true, message: '请输入商品名称', trigger: 'blur'}
        ],
        goodsTypeId: [
          {required: true, message: '请选择商品类型', trigger: 'blur'}
        ],
        goodsPrice: [
          {required: true, message: '请输入商品价格', trigger: 'blur'}
        ],
        goodsImg: [
          {required: true, message: '请上传商品图片', trigger: 'blur'}
        ],
        goodsDesc: [
          {required: true, message: '请输入商品详情', trigger: 'blur'}
        ]
      },
      dialogImageVisible: false,
      dialogImageUrl: '',
      // 商品图片上传headers信息
      headers: {
        'Authorization': window.sessionStorage.getItem('token')
      },
      fileList: [], // 商品图片列表

    }
  },
  methods: {
    handleSuccess(res, file, fileList) {
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            message: '提交成功',
            type: 'success'
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogImageVisible = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      console.log(this.form.goodsImgs);
      //1.获取当前点击的图片的path路径
      const path = file.path
      //2.从goodsImgs中找到图片的索引值
      const index = this.form.goodsImgs.findIndex(item => item.path === path);
      //3.删除goodsImgs中的图片
      this.form.goodsImgs.splice(index, 1);
      //4.删除fileList中的图片
      this.fileList.splice(index, 1);
      console.log("filelist", fileList);
      console.log("imgs", this.form.goodsImgs);
    },
    async upload(param) {
      const formData = new FormData();
      formData.append('file', param.file);
      const {data: res} = await this.$http.post("/admin/goods/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (res.meta.status !== "OK") return this.$message.error(res.meta.msg);
      console.log(res);
      this.fileList.push({
        url: res.data.url,
        uid: res.data.path
      });
      this.form.goodsImgs.push(res.data.path);
      this.$notify({
        title: "",
        message: "上传成功",
        type: "success"
      });
    },
    handleError(err, file, fileList) {
      console.log(err, file, fileList);
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim() === "") {
        row.inputVisible = false;
        row.inputValue = "";
        return;
      }
      const {paramValue} = row;
      paramValue.push(row.inputValue);
      this.saveAttribute(row);
    },
    async saveAttribute(row) {
      //发起请求
      row.inputVisible = false;
      row.inputValue = "";
    },
    //删除参数值
    tagClosed(i, row) {
      /**
       * splice() 方法用于插入、删除或替换数组的元素。
       * 该方法会改变原始数组。
       * 可以通过设置第二个参数为负数，以便从数组末尾开始索引。
       * 如果第三个参数为负数，则会删除从第一个参数开始的元素。
       * 如果第三个参数大于等于数组长度，则会从第一个参数开始插入。
       * 如果第三个参数为 0，则不会改变数组。
       */
      row.paramValue.splice(i, 1);
      this.saveAttribute(row);
    },
    showInput(row) {
      row.paramName = row.paramName + " ";
      row.paramName = row.paramName.trim()
      row.inputVisible = true;
      //让输入框获取焦点

      this.$refs.saveTagInput.$refs.input.focus();
    },
    handleStaticAdd() {
      this.form.staticParamList.push({
        paramName: '',
        paramValue: []
      })
    },
    handleDynamicAdd() {
      this.form.dynamicParamList.push({
        paramName: '',
        paramValue: []
      })
    },
    handleStaticRemove(index) {
      if (this.form.staticParamList.length > 1) {
        this.form.staticParamList.splice(index, 1);
      }else{
        this.form.staticParamList = [{
          paramName: '',
          paramValue: []
        }]
      }
    },
    handleDynamicRemove(index) {
      if (this.form.dynamicParamList.length > 1) {
        this.form.dynamicParamList.splice(index, 1);
      }else{
        this.form.dynamicParamList = [{
          paramName: '',
          paramValue: []
        }]
      }
    }


  }
}
</script>

<style scoped>
/deep/ .el-upload-list__item.is-ready {
  display: none;
}

.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 120px;
}

.type-title {
  font-size: 14px;
}
</style>