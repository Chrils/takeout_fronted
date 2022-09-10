<template>
<div>
  <!-- 面包屑导航区域 -->
  <div class="breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        <router-link to="/welcome">首页</router-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item>店铺信息</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

  <el-card>
    <div id="shop-container">
      <div class="shop-pic">
        <!-- 店铺图片 -->
        <img :src="shop.img" alt="" class="shop-img">
      </div>
      <div class="shop-desc">
        <el-badge :is-dot="state==true" class="item">
          <el-button class="share-button" @click="dialogTableVisible = true" icon="el-icon-message"></el-button>
        </el-badge>
        <el-row :gutter="20">
          <el-col :span="6">店铺名称</el-col>
          <el-col :span="14">
            <h3>{{shop.name}}</h3>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">店铺分类</el-col>
          <el-col :span="14">{{shop.shopTypeName}}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">店铺地址</el-col>
          <el-col :span="14">{{shop.address}}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">店铺负责人</el-col>
          <el-col :span="14">{{shop.username}}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">联系电话</el-col>
          <el-col :span="14">{{shop.phone}}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">营业时间</el-col>
          <el-col :span="14">{{shop.workTime}}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">营业状态</el-col>
          <el-col :span="14">
            <el-tag v-if="shop.openStat===1" type="success">营业中</el-tag>
            <el-tag v-else type="warning">休息中</el-tag>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 商家评分区域 -->
    <div>
      <el-row :gutter="10">
        <el-col :span="7">
          <div class="score-item">
            <span>总体评分: </span>
            <el-rate
                v-model="value1"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}">
            </el-rate>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="score-item">
            <span>服务态度: </span>
            <el-rate
                v-model="value2"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}">
            </el-rate>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="score-item">
            <span>菜品口味: </span>
            <el-rate
                v-model="value3"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}">
            </el-rate>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="switch-toggle">
      <el-switch
          v-model="shop.autoOpen"
          active-text="开启自动营业"
          :active-value="1"
          :inactive-value="0"
          @change="toggleAutoOpen"
      >
      </el-switch>
    </div>

    <div class="switch-toggle">
      <el-switch
          v-model="shop.autoRecv"
          active-text="开启自动接单"
          :active-value="1"
          :inactive-value="0"
          @change="toggleAutoRecv"
      >
      </el-switch>
    </div>

    <!-- 折叠项 -->
    <el-collapse v-model="activeNames">
      <el-collapse-item title="商家公告" name="1">
        <p>{{shop.notice}}</p>
      </el-collapse-item>
    </el-collapse>

    <!-- 店铺操作 -->
    <div class="shop-operate">
      <el-button type="primary" @click="handleEdit">编辑信息</el-button>
      <el-button type="warning" @click="handleDown">{{ shop.openStat === 1 ? '打烊' : '营业' }}</el-button>
    </div>

  </el-card>


  <el-card>
    <el-dialog title="举报信息" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column property="time" label="时间" width="150"></el-table-column>
        <el-table-column property="content" label="内容"></el-table-column>
        <el-table-column property="handleTime" label="截至时间" width="200"></el-table-column>
        <el-table-column label="操作" width="260">
          <template slot-scope="scope">
            <el-button type="success"  @click="handle(scope.row.id)">处理完成</el-button>
            <el-button type="warning" @click="refute(scope.row.id)">发起申诉</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-card>
  <el-card>
    <!-- Form -->
    <el-dialog title="申诉原因" :visible.sync="dialogFormVisible">
      <el-form :model="handleForm">
        <el-form-item label="具体申诉" :label-width="formLabelWidth">
          <el-input v-model="handleForm.sellerAddContent" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="cmp(handleForm.sellerAddContent)">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>

</div>
</template>

<script>
export default {
  name: "profile",
  data(){
    return {
      value: 4.5,
      activeNames: '',
      shop:{},
      shopId:localStorage.getItem('shopId'),
      value1: 0,
      value2: 0,
      value3: 0,
      handleForm: {
        id:'',
        complaintState: '',
        sellerAddContent:'',
      },
      formLabelWidth: '120px',
      dialogTableVisible: false,
      dialogFormVisible: false,
      state: true,
      gridData: [],
    }
  },
  methods: {
    handleEdit(){
      this.$router.push("/merchant/profile/edit");
    },
    async handleDown(){
      let appendStr = this.shop.openStat === 1 ? '打烊' : '营业'
      let stat = this.shop.openStat === 1 ? 0 : 1
      let appendMsg = this.shop.autoOpen === 1 ? `手动${appendStr}会关闭自动营业，` : ``
      this.$confirm(`${appendMsg}确定要${appendStr}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data:res} = await this.$http.put(`/consumer/admin/shop/toggle/open-status/${this.shopId}/${stat}`);
        if(res.meta.status!=="200") return this.$message.error(res.meta.msg);
        this.shop.openStat = stat;
        this.shop.autoOpen = 0;
        this.$message.success(`${appendStr}成功!`);
      }).catch(() => {
        this.$message.info(`已取消${appendStr}`);
      });
    },
    async getShopDetail(){
      const {data:res} = await this.$http.get(`/consumer/admin/shop/detail/${this.shopId}`);
      if(res.meta.status !== "200") return this.$message.error(res.meta.msg);
      this.shop = res.data.data;
    },
    async toggleAutoOpen(val) {
      this.$confirm(`确定要切换自动营业吗?这可能改变您当前店铺的营业状态`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async ()=>{
        const {data: res} = await this.$http.put(`/consumer/admin/shop/toggle/auto-open/${this.shopId}/${val}`)
        if (res.meta.status !== "200") return this.$message.error(res.meta.msg);
        await this.getShopDetail()
      }).catch(()=>{
        this.$message.info("已取消")
      })

    },
    async toggleAutoRecv(val){
      const {data: res} = await this.$http.put(`/consumer/admin/shop/toggle/auto-recv/${this.shopId}/${val}`)
      if (res.meta.status !== "200") return this.$message.error(res.meta.msg);
    },
    async isComplaint() {
      const userId = localStorage.getItem('shopId')
      const {data: res} = await this.$http.get("ym/isComplaint", {params: {userId}});
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      this.state = res.data.data;
    },
    async score() {
      const shopId = localStorage.getItem('shopId');
      const {data: res} = await this.$http.get("ky/getScore", {params: {shopId}});
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      this.value1 = res.data.data.populationScore
      this.value2 = res.data.data.flavorScore
      this.value3 = res.data.data.packingScore
    },
    async selComplaint() {
      const userId = JSON.parse(localStorage.getItem('user')).userId;
      const {data: res} = await this.$http.get("ym/selComplaint?userId="+userId);
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      res.data.data.forEach((item)=>{
        this.gridData.push({
          id:item.id,
          time:item.time,
          content:item.content,
          handleTime:item.handleTime,
        })
      })
    },
    async handle(id) {
      this.handleForm.id=id;
      this.handleForm.complaintState=2;
      const {data: res} = await this.$http.get("ym/updateComplaint", {params: this.handleForm});
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      this.gridData=[];
      this.selComplaint();
      this.isComplaint();
    },
    async refute(id) {
      this.dialogFormVisible = true;
      this.handleForm.id=id;
      this.handleForm.complaintState=1;
    },
    async cmp(sellerAddContent) {
      this.dialogFormVisible = false;
      this.handleForm.sellerAddContent=sellerAddContent;
      const {data: res} = await this.$http.get("ym/updateComplaint", {params: this.handleForm});
      if (res.meta.status !== "200") {
        return this.$message.error(res.meta.msg)
      }
      this.gridData=[];
      this.isComplaint();
      this.selComplaint();
    },
  },
  created() {
    this.getShopDetail();
    this.isComplaint();
    this.score();
    this.selComplaint();
  }
}
</script>

<style scoped lang="less">
#shop-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

> .shop-desc {
  width: 60%;
  margin-left: 20px;
  height: 100%;
  line-height: 40px;
}
}

.percentage {
  font-size: 20px;
  color: #ff9900;
}

.score-item {
  display: flex;
  justify-content: left;
  align-items: center;
  margin-bottom: 10px;
}

.multi-right{
  text-align: right;
}

.shop-operate{
  display: flex;
  justify-content: right;
  margin-bottom: 20px;
}

.switch-toggle{
  display: flex;
  justify-content: left;
  margin-top: 20px;
  margin-bottom: 20px;
}

.shop-img{
  width: 80%;
}
</style>