<template>
  <div class="login">
    <div class="container">
      <el-form :model="LoginForm" :rules="rules" ref="LoginForm" class="demo-ruleForm">
        <img src="../assets/2.jpg" alt class="avatar">
        <el-form-item prop="username">
          <el-input  v-model="LoginForm.username" prefix-icon="myicon myicon-user" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password"  v-model="LoginForm.password" prefix-icon="myicon myicon-key" @keydown.enter.native="LoignSubmit('LoginForm')" placeholder="密码"></el-input>
        </el-form-item>
        <el-button type="primary" @click="LoignSubmit('LoginForm')" class="login-btn">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
// 接收后台登录接口
import { login } from '@/api/index.js'
export default {
  data () {
    return {
      LoginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 这是登录按钮
    LoignSubmit (formname) {
      // 用一个验证函数validate 参数为valid
      this.$refs[formname].validate((valid) => {
        // 如果验证成功
        if (valid) {
          login(this.LoginForm)
            .then((result) => {
              if (result.meta.status === 200) {
                // 设置token
                localStorage.setItem('Login_token', result.data.token)
                // 跳路由
                this.$router.push({ name: 'Home', path: '/home' })
              } else {
                this.$message.error(result.meta.msg)
              }
            })
            // 验证失败
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;

  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
