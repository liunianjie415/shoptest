<template>
<div class="login-wrap">
    <span class="title">超市后台管理系统</span>
    <el-form class="login-form" label-position="top" label-width="80px" :model="formdata">
        <el-form-item label="账号">
            <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input v-model="formdata.password" @keyup.enter.native="handleLogin()"></el-input>
        </el-form-item>
        <el-button type="primary" class="login-btn" @click.prevent="handleLogin()">登 录</el-button>
    </el-form>
</div>
</template>

<script>
export default {
  data() {
      return {
          formdata: {
            username: '',
            password: ''
          }
      }
  },
  methods: {
    async handleLogin() {
      const res = await this.$http.get('showEmp')
      const data = res.data
      // console.log(data);
      for (let i = 0; i < data.length; i++) {
        if (this.formdata.username !== data[i].ename) {
          this.$message.error('账号不存在');
        } else if (this.formdata.username === data[i].ename && this.formdata.password !== data[i].epassword) {
          this.$message.error('密码错误');
        } else {
          localStorage.setItem('user', data[i].ename)   
          this.$message({
            message: '恭喜你，登陆成功',
            type: 'success'
          })
          this.$router.push({
            name: 'home'
          })
        }
      }
    }
  }
}
</script>

<style>
.login-wrap {
    height: 100%;
    background-color: #324152;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-wrap .login-form {
    background-color: #fff;
    width: 400px;
    padding: 30px;
    border-radius: 5px;
}

.login-wrap .login-form .login-btn {
    width: 100%;
    font-size: 20px;
}

.title {
    display: block;
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 55px;
    font-weight: bolder;
    color: #fff;
    text-shadow: 4px 4px 8px #000;
}

.el-form-item__label {
    font-size: 20px;
}
</style>
