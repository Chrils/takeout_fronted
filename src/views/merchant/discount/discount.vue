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
              <template v-for="(item,index) in discountList">
                <p>
                  <span>满 {{item[0]}} 元减 {{item[1]}} 元</span>
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDiscount(item,index)"></el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteDiscount(item,index)"></el-button>
                </p>
                <br/>
              </template>

              <p><i class="el-icon-plus"></i></p>
            </div>
          </div>
        </div>
        <div style="width: 100%">
          <p class="discount-title">优惠券信息</p>
          <el-row :gutter="20">
            <el-col :span="4">
              <el-select v-model="queryInfo.voucherTimeLimit" placeholder="过期时间" @change="search">
                <el-option label="全部" :value="''"></el-option>
                <el-option label="无限制" :value="'NO_LIMIT'"></el-option>
                <el-option label="有过期时间" :value="'LIMIT'"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-input v-model="queryInfo.voucherId" placeholder="请输入优惠券编号">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
              </el-input>
            </el-col>
            <el-col :span="3">
              <el-switch v-model="queryInfo.voucherStatus" active-value="PUBLISH" inactive-value="" active-text="只看可用券" @change="search"></el-switch>
            </el-col>
          </el-row>

          <el-table :data="tableData" border tooltip-effect="dark">
            <el-table-column label="优惠券编号" prop="voucherId"></el-table-column>
            <el-table-column label="优惠券名称" prop="voucherTitle" width="180" show-overflow-tooltip></el-table-column>
            <el-table-column label="优惠券类型" prop="voucherRangeLimit">
              <template slot-scope="scope">
                <span v-if="scope.row.voucherRangeLimit === 'ALL'">通用券</span>
                <span v-else-if="scope.row.voucherRangeLimit === 'BY_TYPE'">分区券</span>
                <span v-else-if="scope.row.voucherRangeLimit === 'BY_SHOP'">商家券</span>
              </template>
            </el-table-column>
            <el-table-column label="优惠券起用金额" prop="startMoney"></el-table-column>
            <el-table-column label="优惠券面额" prop="discountMoney"></el-table-column>
            <el-table-column label="优惠券有效期" prop="voucherStartTime" width="170">
              <template slot-scope="scope">
                <template v-if="scope.row.voucherTimeLimit === 'NO_LIMIT'">无限制</template>
                <template v-else>
                  <span>{{ scope.row.voucherStartTime }}</span>
                  <span>至</span>
                  <span>{{ scope.row.voucherEndTime }}</span>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="优惠券状态" prop="voucherStatus" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.voucherStatus === 'PUBLISH'">已发布</span>
                <span v-else-if="scope.row.voucherStatus === 'ON'">未发布</span>
                <span v-else>已过期</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <el-button type="warning" icon="el-icon-upload2" v-if="scope.row.voucherStatus !== 'PUBLISH'" :disabled="scope.row.voucherStatus === 'PUBLISH' || scope.row.voucherStatus === 'DEPRECATED'" size="mini"
                           @click="handlePublish(scope.row)">发布
                </el-button>
                <el-button type="warning" icon="el-icon-upload2" v-else size="mini"
                           @click="handleCancelPublish(scope.row)">取消发布
                </el-button>
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="pageNo" :page-sizes="[5, 10, 20, 50, 100]"
                         :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                         :total="total">
          </el-pagination>
        </div>
      </div>
    </el-card>

    <el-dialog :title="discountAdding ? '新增折扣' : '修改折扣'" :visible.sync="discountDialogVisible" width="30%">
      <div>
        满
        <el-input v-model="discountForm.startAmount"></el-input>
        减
        <el-input v-model="discountForm.discountAmount"></el-input>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="submitDiscountForm">提交</el-button>
        <el-button @click="discountDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 新增优惠券对话框 -->
    <el-dialog :title="adding ? '新增优惠券' : '编辑优惠券'" :visible.sync="dialogVisible" width="60%">
      <el-form :model="form" :rules="rules" ref="form" label-width="130px">
        <el-form-item label="优惠券名称" prop="voucherTitle">
          <el-input v-model="form.voucherTitle" placeholder="请输入优惠券名称"></el-input>
        </el-form-item>
        <el-form-item label="优惠券数量限制" prop="voucherNumLimit">
          <el-radio-group v-model="form.voucherNumLimit">
            <el-radio label="NO_LIMIT">不限制数量</el-radio>
            <el-radio label="LIMIT">指定数量</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.voucherNumLimit === 'LIMIT'" label="优惠券数量" prop="voucherNum">
          <el-input-number type="number" v-model="form.voucherNum" placeholder="请输入优惠券数量"></el-input-number>
        </el-form-item>
        <el-form-item label="优惠券启用金额" prop="startMoney">
          <el-input-number type="number" v-model="form.startMoney" placeholder="请输入优惠券启用金额"></el-input-number>
        </el-form-item>
        <el-form-item label="优惠券面额" prop="discountMoney">
          <el-input-number type="number" v-model="form.discountMoney" placeholder="请输入优惠券面额"></el-input-number>
        </el-form-item>
        <el-form-item label="优惠券有效期" prop="voucherTimeLimit">
          <el-radio-group v-model="form.voucherTimeLimit">
            <el-radio label="NO_LIMIT">无限制</el-radio>
            <el-radio label="LIMIT">设置有效期</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="优惠券有效期" prop="voucherStartTime" v-if="form.voucherTimeLimit === 'LIMIT'">
          <el-date-picker v-model="form.voucherStartTime" type="datetime" placeholder="请选择优惠券有效期开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="优惠券有效期" prop="voucherEndTime" v-if="form.voucherTimeLimit === 'LIMIT'">
          <el-date-picker v-model="form.voucherEndTime" type="datetime" placeholder="请选择优惠券有效期结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="优惠券派发机制" prop="voucherDispatchLimit">
          <el-radio-group v-model="form.voucherDispatchLimit">
            <el-radio label="AUTO">自动分发</el-radio>
            <el-radio label="MANUEL">手动领取</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.voucherDispatchLimit==='AUTO'" label="优惠券派发类型" prop="voucherDispatchTypeLimit">
          <el-radio-group v-model="form.voucherDispatchTypeLimit">
            <el-radio label="SHOP_FANS">粉丝发放</el-radio>
          </el-radio-group>
        </el-form-item>



        <el-form-item label="优惠券说明" prop="voucherRule">
          <el-input v-model="form.voucherRule" placeholder="请输入优惠券说明"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="btnLoading">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
export default {
  name: "discount",
  data() {
    return {
      shopId: localStorage.getItem('shopId'),
      discountDialogVisible: false,
      dialogVisible: false,
      discountForm: {
        startAmount: '',
        discountAmount: ''
      },
      queryInfo: {
        voucherId: '',
        voucherStatus: 'ALL',
        voucherRangeLimit: 'BY_SHOP',
        voucherTimeLimit: '',
        voucherAmountLimit: '',
        shopId: localStorage.getItem('shopId')
      },
      pageNo: 1,
      pageSize: 5,
      tableData: [],
      areaList:[],
      total: 0,
      btnLoading: false,
      rules: {
        voucherId: [
          { required: true, message: '请输入优惠券编号', trigger: 'blur' },
        ],
        voucherTitle: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' },
        ],
        voucherNumLimit:[
          { required: true, message: '请选择优惠券数量类型', trigger: 'blur' },
        ],
        voucherRangeLimit: [
          { required: true, message: '请选择优惠券类型', trigger: 'blur' },
        ],
        voucherDispatchLimit: [
          { required: true, message: '请选择优惠券派发机制', trigger: 'blur' },
        ],
        voucherDispatchTypeLimit: [
          { required: true, message: '请选择优惠券派发类型', trigger: 'blur' },
        ],
        startMoney: [
          { required: true, message: '请输入优惠券起用金额', trigger: 'blur' },
          { type: 'number',message: '请输入数字',trigger: 'blur'},
          //限制最小值为0
          { validator: (rule, value, callback) => {
              if(0 > value){
                callback(new Error('起用金额不能小于0'));
              }if(value < this.form.discountMoney){
                callback(new Error('起用金额不能小于优惠券面额'));
              }else{
                callback()
              }
            } },
          //限制最大值为9999999
          { validator: (rule, value, callback) => {
              if(value > 9999999){
                callback(new Error('数量不能大于9999999'));
              }else{
                callback();
              }
            } },
        ],
        discountMoney: [
          { required: true, message: '请输入优惠券面额', trigger: 'blur' },
          { type: 'number',message: '请输入数字',trigger: 'blur'},
          //限制最小值为0.1
          { validator: (rule, value, callback) => {
              if(0.1 > value){
                callback(new Error('优惠券面额不能小于0.1'));
              }else if(value > this.form.startMoney){
                callback(new Error('优惠券面额不能大于启用金额'));
              }else{
                callback()
              }
            } },
          //限制最大值为9999999
          { validator: (rule, value, callback) => {
              if(value > 9999999){
                callback(new Error('优惠券面额不能大于9999999'));
              }else{
                callback();
              }
            } },
        ],
        voucherNum: [
          { required: true, message: '请输入优惠券数量', trigger: 'blur' },
          { type: 'number',message: '请输入数字',trigger: 'blur'},
          //限制最小值为1
          { validator: (rule, value, callback) => {
              if(1 > value){
                callback(new Error('数量不能小于1'));
              }else{
                callback();
              }
            } },
          //限制最大值为9999999
          { validator: (rule, value, callback) => {
              if(value > 9999){
                callback(new Error('数量不能大于9999'));
              }else{
                callback();
              }
            } },

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
        voucherRule: [
          { required: true, message: '请输入优惠券说明', trigger: 'blur' },
        ],
        typeId: [
          { required: true, message: '请选择优惠券适用分区', trigger: 'blur' },
        ],
      },
      form: {
        voucherId: '',
        voucherTitle:'',
        voucherRangeLimit: 'BY_SHOP',
        voucherTimeLimit: '',
        voucherNumLimit: '',
        shopId:this.shopId,
        typeId: '',
        voucherNum:0,
        startMoney:0,
        discountMoney:0,
        voucherDispatchLimit: '',
        voucherDispatchTypeLimit: 'SHOP_FANS',
        voucherRule:''
      },
      discountList:[],
      discountAdding: false,
      adding: false,
      discountEditingIndex: 0

    }
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (this.form.voucherDispatchLimit==="MANUEL"){
            //日期格式化
            this.form.voucherStartTime = this.$moment(this.form.voucherStartTime).format('yyyy-MM-DD HH:mm:ss')
            this.form.voucherEndTime = this.$moment(this.form.voucherEndTime).format('yyyy-MM-DD HH:mm:ss')
            delete this.form.voucherDispatchTypeLimit
          }else{
            //日期格式化
            this.form.voucherStartTime = this.$moment(this.form.voucherStartTime).format('yyyy-MM-DD HH:mm:ss')
            this.form.voucherEndTime = this.$moment(this.form.voucherEndTime).format('yyyy-MM-DD HH:mm:ss')
          }
          if (this.adding){
            const {data:res} = await this.$http.post("/consumer/voucher/add",this.form)
            if (res.meta.status !== '200') return this.$message.error(res.meta.msg)
            this.$notify.success("添加成功")
            this.dialogVisible = false
            await this.getList()
          }else{
            const {data:res} = await this.$http.put("consumer/voucher/update",this.form)
            if (res.meta.status !== '200') return this.$message.error(res.meta.msg)
            this.$notify.success("修改成功")
            this.dialogVisible = false
            await this.getList()
          }
        } else {
          return false;
        }
      })
    },
    handleReset() {
      this.$refs.form.resetFields();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getList();
    },
    async getList() {
      const {data:res} = await this.$http.get(`consumer/voucher/page/${this.pageNo}/${this.pageSize}`,{
        params:this.queryInfo
      })
      if (res.meta.status !== '200') return this.$message.error(res.meta.msg)
      this.tableData = res.data.data.records
      this.total = res.data.data.total;
    },
    handleEdit(row) {
      this.form = row;
      this.adding = false;
      this.dialogVisible = true;
    },
    handleDelete(row) {
      this.$confirm('确认要删除优惠券吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data:res} = await this.$http.delete("consumer/voucher/delete/"+row.voucherId)
        if (res.meta.status !== '200') return this.$message.error(res.meta.msg)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        await this.getList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    addDiscount() {
      this.discountForm = {
        startAmount:'',
        discountAmount:''
      }
      this.discountAdding = true
      this.discountDialogVisible = true;
    },
    editDiscount(item,index) {
      this.discountForm.startAmount=item[0]
      this.discountForm.discountAmount=item[1]
      this.discountEditingIndex = index
      this.discountAdding = false
      this.discountDialogVisible = true;
    },
    async getShopDetail(){
      const {data:res} = await this.$http.get(`/consumer/admin/shop/detail/${this.shopId}`);
      if(res.meta.status !== "200") return this.$message.error(res.meta.msg);
      this.discountList = []
      let parr = res.data.data.discount.split(',')
      for (let parrElement of parr) {
        this.discountList.push(parrElement.split('-'))
      }
    },
    handleAdd() {
      this.adding = true
      this.dialogVisible = true;
      this.$nextTick(()=>{
        this.$refs.form.resetFields()
        this.$refs.form.clearValidate()
      })
      this.form = {
        voucherId: '',
        voucherTitle:'',
        voucherRangeLimit: 'BY_SHOP',
        voucherTimeLimit: '',
        voucherNumLimit: '',
        shopId:this.shopId,
        typeId: '',
        voucherNum:0,
        startMoney:0,
        discountMoney:0,
        voucherDispatchLimit: '',
        voucherDispatchTypeLimit: 'SHOP_FANS',
        voucherRule:''
      }
    },
    deleteDiscount(item,index) {
      this.$confirm('确定删除该折扣吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.discountList.splice(index,1)
        let str = "";
        this.discountList.forEach(arr => {
          str += (arr.join('-')+',')
        })
        str = str.substring(0,str.length-1)
        const {data:res} = await this.$http.put(`/consumer/admin/shop/discount/${this.shopId}/${str}`)
        if (res.meta.status !== "200") return this.$message.error(res.meta.msg);
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
      this.pageNo = 1;
      this.getList();
    },
    handlePublish(row) {
      this.$confirm('确认发布该优惠券?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data:res} = await this.$http.put("consumer/voucher/publish/"+row.voucherId)
        if (res.meta.status !== '200') return this.$message.error(res.meta.msg)
        this.$message({
          type: 'success',
          message: '发布成功!'
        });
        await this.getList()
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
      }).then(async () => {
        const {data:res} = await this.$http.put("consumer/voucher/cancel/"+row.voucherId)
        if (res.meta.status !== '200') return this.$message.error(res.meta.msg)
        this.$message({
          type: 'success',
          message: '取消发布成功!'
        });
        await this.getList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    async getCateList(){
      const {data:res} = await this.$http.get("/consumer/client/shop-type/list/without-page")
      if (res.meta.status !== "200") return this.$message.error(res.meta.msg)
      this.areaList = res.data.data;
    },
    async submitDiscountForm(){
      if (!/^[1-9][0-9]{0,6}$/.test(this.discountForm.startAmount) || !/^[1-9][0-9]{0,6}$/.test(this.discountForm.discountAmount)){
        return this.$notify.warning("请输入正确的数字")
      }
      console.log(this.discountForm)
      if (this.discountForm.startAmount-0 < this.discountForm.discountAmount-0){
        return this.$notify.warning("起始金额不能小于满减金额")
      }
      if (!this.discountAdding){
        this.discountList.splice(this.discountEditingIndex,1)
      }
      this.discountList.push([this.discountForm.startAmount,this.discountForm.discountAmount])
      let str = "";
      this.discountList.forEach(arr => {
        str += (arr.join('-')+',')
      })
      str = str.substring(0,str.length-1)
      const {data:res} = await this.$http.put(`/consumer/admin/shop/discount/${this.shopId}/${str}`)
      if (res.meta.status !== "200") return this.$message.error(res.meta.msg);
      this.discountDialogVisible = false;
    }

  },
  created() {
    this.getShopDetail()
    this.getCateList()
    this.getList()
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