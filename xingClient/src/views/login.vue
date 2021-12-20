<template>
  <div class="login">
    <div class="loginBox">
      <h3>用户登录</h3>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="login_form">

        <el-form-item label="用户名:" prop="username">
          <el-input type="text" v-model="ruleForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码:" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off" show-password></el-input>
        </el-form-item>

        <el-form-item label="确认密码:" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" show-password></el-input>
        </el-form-item>

        <el-form-item class="button">
          <el-button size="small" type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    const checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名'))
      }
      setTimeout(() => {
        callback()
      }, 1000)
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        pass: '',
        checkPass: '',
        username: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        username: [
          { validator: checkAge, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 消息提示
    open2 (mes, type) {
      this.$message({
        message: mes,
        type: type
      })
    },
    submitForm (formName) {
      const username = 'admin'
      const password = 'root123'
      const token = 'IIIDDDBBBBSHHHHUGIKOKOOOOOOOO'

      this.$refs[formName].validate((valid) => {
        if (valid) {
          /// 登录验证
          if (this.ruleForm.username === username && this.ruleForm.pass === password) {
            window.sessionStorage.setItem('token', token)
            this.$router.push('/index/write')
            this.open2('登陆成功', 'success')
          } else {
            this.$message.error('登陆失败，请检查用户名和密码')
          }
        } else {
          this.open2('输入的两次密码不一致，或者用户名为空，请重新输入', 'waring')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.login{
  height: 100%;
  background: url(../../public/logo1.jpg) no-repeat;
  background-size: 40%;
  background-position: 20% 0%;
}
.loginBox{
  width: 25%;
  height: 55%;
  background-color: rgba(241, 241, 241, 0.795);
  border-radius: 10px;
  position: absolute;
  left: 70%;
  top:65%;
  transform: translate(-50%,-60%);
  box-shadow: whitesmoke;
}
.loginBox h3{
  text-align: center;
  font-size: 30px;
}
.button{
  display: flex;
  justify-content: flex-end;
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
