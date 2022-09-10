<template>
  <div class="login_container">
    <div class="login_box">
		<!-- 头像区域 -->
	  <div class="avatar_box">
		<img src="@/assets/img/header_m.png" alt="header" >
	  </div>
      <!-- 注册表单区域 -->
      <el-form ref="LoginFormRef" :model="LoginForm" :rules="LoginFormRules" label-width="85px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username" label="用户名:">
		  <el-input v-model="LoginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password" label="密码:">
		  <el-input v-model="LoginForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
		<el-form-item prop="repassword" label="确认密码:">
		  <el-input v-model="LoginForm.repassword" type="password" placeholder="确认密码"></el-input>
		</el-form-item>
		<el-form-item prop="phone" label="手机号:">
		  <el-input v-model="LoginForm.phone" placeholder="请输入手机号"></el-input>
		</el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">注册</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
	    </el-form>
    </div>
  </div>
</template>

<script>

  export default{
	  data(){
		  //验证两次密码是否一致规则
		  var validatePass2 = (rule, value, callback) => {
		    if (value === '') {
		  	 callback(new Error('请再次输入密码'))
		  	 // password 是表单上绑定的字段
		    } else if (value !== this.LoginForm.password) {
		  	 callback(new Error('两次输入密码不一致!'))
		    } else {
		  	 callback()
		    }
		  };
		  var checkname = async (rule, value, callback) => {
			await this.nameRules()
			if(this.usernameRule){
			  callback(new Error("用户名已存在，请重新输入"))
			}else{
			  callback()
			}
		  };
		  var checkphone = async (rule, value, callback) => {
			await this.phoneRules()
			if(this.phoneRule){
			  callback(new Error("手机号已存在，请重新输入"))
			}else{
			  callback()
			}
		  };

		  return {
		    // 表单数据绑定对象
			usernameRule:'',
			phoneRule:'',
		    LoginForm:{
			    username:'',
			    password:'',
			    repassword:'',
			    phone:'',
		    },
			
			  // 表单验证规则对象
			LoginFormRules:{
			  //验证用户名是否合法
			  username:[
				{required:true,message:'用户名不能为空',trigger:'blur'},
				{min:3,max:10,message:'用户名长度为3-10位',trigger:'blur'},
				{ required: true, validator: checkname, trigger: 'blur' }
			  ],
			  //验证密码是否合法
			  password:[
				{required:true,message:'密码不能为空',trigger:'blur'},
				{min:5,max:10,message:'密码长度为5-10位',trigger:'blur'}
			  ],
			  repassword:[
				{ required: true, validator: validatePass2, trigger: 'blur' }
			  ],
			  phone:[
				{required:true,message:'手机号不能为空',trigger:'blur'},
				{pattern:/^1[3-9]\d{9}$/,message:'手机格式不正确',trigger:'blur'},
				{ required: true, validator: checkphone, trigger: 'blur' }
			  ]
			},
			
		  }
	  },
    methods:{
      // 重置表单
      resetLoginForm(){
        this.$refs.LoginFormRef.resetFields();
      },
      //表单预验证
      login(){
        //打印原型中的$http属性
        console.log();
        //async修饰的函数，可以异步执行
        this.$refs.LoginFormRef.validate(async valid =>{
          //valid表示验证是否通过
          if(!valid){return;}
          //验证通过，发送登录请求
          //await用于等待异步操作完成，必须使用async声明
		  let registerUser={
			  username:this.LoginForm.username,
			  password:this.LoginForm.password,
			  phone:this.LoginForm.phone
		  }
          const {data : res} = await this.$http.post('user/register',registerUser)
          console.log(res)
          if (res.meta.status === "200"){
			  console.log("注册成功")
              await this.$router.push('/login');
          }else{
            this.$message.error(res.meta.msg);
          }
        });
      },
	  //验证用户名是否已存在
		async nameRules() {
			const res=await this.$http.post("user/userNameRule?username=" + this.LoginForm.username)//访问后台
			console.log(res)
			if( res.data.meta.status == "200") {
				this.usernameRule=true
			}else{
				this.usernameRule=false
			}
		},
		async phoneRules() {
			const res=await this.$http.post("user/phoneRule?phone=" + this.LoginForm.phone)//访问后台
			console.log(res)
			if( res.data.meta.status == "200") {
				this.phoneRule=true
			}else{
				this.phoneRule=false
			}
		},

    }

  }
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;

    .login_box {
      width: 450px;
      height: 400px;
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
</style>
