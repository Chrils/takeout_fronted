<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="@/assets/img/header_m.png" alt="header" >
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="LoginFormRef" :model="LoginForm" :rules="LoginFormRules" label-width="85px" class="login_form">
       <!-- 用户名 -->
       <el-form-item prop="username" label="用户名:">
         <el-input v-model="LoginForm.username"></el-input>
       </el-form-item>
	   <!-- 手机号 -->
       <el-form-item prop="email" label="邮箱:">
         <el-input v-model="LoginForm.email" style="width: 201px;"></el-input>
		 <el-button class="yzm-class" type="info" @click="sendYZM" :disabled="allowBt">{{yzmbtn}}</el-button>
       </el-form-item>
	   <!--验证码-->
	   <el-form-item prop="yzm" label="验证码:">
	     <el-input v-model="LoginForm.yzm"></el-input>
	   </el-form-item>
       <!-- 密码 -->
       <el-form-item prop="password" label="新密码:">
         <el-input v-model="LoginForm.password" type="password" ></el-input>
       </el-form-item>
	   <!-- 确认密码 -->
       <el-form-item prop="repassword" label="确认密码:">
         <el-input v-model="LoginForm.repassword" type="password" ></el-input>
       </el-form-item>

        <!-- 按钮区域 -->
        <el-form-item class="btns">
			
          <el-button type="primary" @click="toSubmit">确认</el-button>
          <el-button type="info" @click="resetLoginForm">取消</el-button>
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
		  	 callback(new Error('密码不能为空'))
		  	 // password 是表单上绑定的字段
		    } else if (value !== this.LoginForm.password) {
		  	 callback(new Error('两次输入密码不一致!'))
		    } else {
		  	 callback()
		    }
		  };
		  var checkname = async (rule, value, callback) => {
			await this.nameRules()
			if(!this.usernameRule){
			  callback(new Error("用户名不存在，请重新输入"))
			}else{
			  callback()
			}
		  };
		  var yzmCheck = (rule, value, callback) => {
			//this.yzmRules()
			if(!this.yzmRules()){
			  callback(new Error("验证码错误"))
			}else{
			  callback()
			}
		  };
		  return {
			  // 表单数据绑定对象
			  LoginForm:{
				  username:'',
				  phone:'',
				  password:'',
				  repassword:'',
				  yzm:'',
				  email:''
			  },
			  yzmCode:'',
			  yzmbtn:'获取验证码',
			  time:0,
			  allowBt:false,
			  timer:null,
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
				],
				yzm:[
					{required:true,message:'验证码不能为空',trigger:'blur'},
					{ required: true, validator: yzmCheck, trigger: 'blur' }
				],
				//验证用户名是否合法
				email:[
					{required:true,message:'邮箱不能为空',trigger:'blur'},
					{pattern:/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,message:'邮箱格式不正确',trigger:'blur'},
				],
			}
		  }
	  },
    methods:{
      // 重置表单
      resetLoginForm(){
        this.$refs.LoginFormRef.resetFields();
      },
      //表单预验证
      toSubmit(){
        //打印原型中的$http属性
        console.log();
        //async修饰的函数，可以异步执行
        this.$refs.LoginFormRef.validate(async valid =>{
          //valid表示验证是否通过
          if(!valid){return;}
          //验证通过，发送修改密码请求
          //await用于等待异步操作完成，必须使用async声明
		  //根据用户名修改用户密码
          const {data : res} = await this.$http.post('user/updPwd?username='+this.LoginForm.username+'&password='+this.LoginForm.password)
          if (res.meta.status === "200"){
            //保存token到sessionStorage
            this.$message.success(res.meta.msg);
            await this.$router.push('/login')
          }else{
            this.$message.error(res.meta.msg);
          }
        });
      },
      
	  toRegister(){
		  this.$router.push('/user/register')
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
	 
	  async sendYZM(){
		  if(this.LoginForm.email==""){
			  this.LoginFormRules.email
			  return
		  }
		  const {data:res}=await this.$http.post("user/sendEmail/"+this.LoginForm.email)//访问后台
		  this.allowBt=true
		  this.time=60
		  this.timer1();
		  if(res.meta.status=="200"){
			  this.yzmCode=res.data.data
		  }
		  this.yzmRules()
	  },
	  yzmRules(){
			//console.log("yzm:"+this.LoginForm.yzm)
		  if(this.LoginForm.yzm==this.yzmCode){
			  return true
		  }else{
			  return false
		  }
	  },
	  timer1(){
		  if(this.time > 0) {
			  this.time--;
			  this.yzmbtn = this.time + "s"
			  this.timer = setTimeout(this.timer1,1000)
		  }else{
			  this.time = 0;
			  this.yzmbtn = "获取验证码";
			  this.allowBt = false;
			  clearTimeout(this.timer);
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
      height: 440px;
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
	.yzm-class{
		margin-left: 12px;
	}
	.el-form-item__content{
	  display: flex;
	}
	
	
</style>
