<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="@/assets/img/header_m.png" alt="header">
      </div>
      <div class="register">
        <a href="javascript:void(0)" @click="toRegister">注册账户</a>
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="LoginFormRef" :model="LoginForm" :rules="LoginFormRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="LoginForm.username"
                    @keyup.enter.native="login"
                    ref="username"
                    @keyup.down.native="passwordFocus">
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="LoginForm.password" type="password"
                    @keyup.enter.native="login"
                    ref="password"
                    @keyup.up.native="usernameFocus">
          </el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">

          <a href="javascript:void(0)" @click="findPwd">找回密码</a>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      // 表单数据绑定对象
      LoginForm: {
        username: '',
        password: ''
      },
      // 表单验证规则对象
      LoginFormRules: {
        //验证用户名是否合法
        username: [
          {required: true, message: '用户名不能为空', trigger: 'blur'},
          {min: 3, max: 10, message: '用户名长度为3-10位', trigger: 'blur'}
        ],
        //验证密码是否合法
        password: [
          {required: true, message: '密码不能为空', trigger: 'blur'},
          {min: 5, max: 10, message: '密码长度为5-10位', trigger: 'blur'}
        ]
      },
      socket: '',
      socketObj: {
        sendId: 1,
        roomId: 1,
      }
    }
  },
  methods: {
    // 重置表单
    resetLoginForm() {
      this.$refs.LoginFormRef.resetFields();
    },
    //表单预验证
    login() {
      //打印原型中的$http属性
      console.log();
      //async修饰的函数，可以异步执行
      this.$refs.LoginFormRef.validate(async valid => {
        //valid表示验证是否通过
        if (!valid) {
          return;
        }
        //验证通过，发送登录请求
        //await用于等待异步操作完成，必须使用async声明
        const {data: res} = await this.$http.post('user/login', this.LoginForm)
        if (res.meta.status === "200") {
          //保存token到sessionStorage
          sessionStorage.setItem('Authorization', res.data.data);
          this.$message.success(res.meta.msg);
          const {data: newres} = await this.$http.get('user/findUserByToken', res.data.data)
          localStorage.setItem("user", JSON.stringify(newres.data.data))
          console.log(newres)
          if (newres.data.data.roleId === 1 || newres.data.data.roleId===6 ) {
            //超级管理员或者管理员
            const {data:shopRes} = await this.$http.get("consumer/admin/shop/my-shop/"+newres.data.data.userId)
            if (shopRes.meta.status !== '200') return this.$message.error(shopRes.meta.msg)
            console.log(shopRes)
            localStorage.setItem("shopId",shopRes.data.data)
            localStorage.setItem("autoRecv",shopRes.data.autoRecv+'')
            console.log(shopRes)
            this.socketInit()
            await this.$router.push('/home');
          } else if(newres.data.data.roleId === 2) {
            console.log("===================")
            console.log(newres.data.data)
            //商家
            //登录之后和webSocket建立连接
            const {data:shopRes} = await this.$http.get("consumer/admin/shop/my-shop/"+newres.data.data.userId)
            if (shopRes.meta.status !== '200') return this.$message.error(shopRes.meta.msg)
            console.log(shopRes)
            localStorage.setItem("shopId",shopRes.data.data)
            localStorage.setItem("autoRecv",shopRes.data.autoRecv+'')
            console.log(shopRes)
            this.socketInit()
            await this.$router.push('/merchant/goods/list')
          }else{
            await this.$router.push('/client/index');
          }
        } else {
          this.$message.error(res.meta.msg);
        }
        // if (res.meta.status !== 200) {
        //   return console.log("登录失败");
        // }
        // console.log("登录成功");
      });
    },
    // 用户名获取焦点
    usernameFocus() {
      this.$refs.LoginFormRef.validateField('password');
      this.$refs.username.focus();
    },
    // 密码获取焦点
    passwordFocus() {
      this.$refs.LoginFormRef.validateField('username');
      this.$refs.password.focus();
    },
    toRegister() {
      this.$router.push('/user/register')
    },
    findPwd() {
      this.$router.push('/findPwd')
    },
    socketInit: function () {
      if (typeof (WebSocket) === "undefined") {
        alert("您的浏览器不支持socket")
      } else {
        // 实例化socket
        this.socket = new WebSocket(`ws://192.168.2.112:8082/webSocket/${this.socketObj.sendId}`)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.getMessage
        this.socket.onclose = this.toClose
      }
    },
    open: function () {
      console.log("socket连接成功")
    },
    error: function () {
      console.log("连接错误")
    },
    getMessage: function (msg) {
      // let data=JSON.parse(msg.data)
      this.$notify.success(msg.data)
      let arr = msg.data.split('订单编号:')
      if(arr[1]){
        if(localStorage.getItem("autoRecv")=='1'){
          let orderId = arr[1]
          this.$http.put("consumer/order/merchant/receive/"+orderId).then(()=>{
            this.$notify.success('已为您自动接单')
          })
        }
      }
    },
    toClose: function () {
      console.log("连接关闭")
    }
  }

}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #FFFFFF;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

.avatar_box {
  height: 130px;
  width: 130px;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;

  img {
    border: 1px solid #eee;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.btns a {
  margin-right: 210px;
  font-size: 12px;
}

.btns a:hover {
  text-decoration: underline;
}

.register {
  margin-top: 20px;
  margin-left: 360px;
}

.register a {
  color: red;
}
</style>
