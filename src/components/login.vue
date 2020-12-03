<template>
<div class="login-wrap">
    <span class="title">超市后台管理系统</span>
    <el-form class="login-form" label-position="top" label-width="80px" :model="formdata">
        <el-form-item label="账号">
            <el-input v-model="formdata.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input v-model="formdata.password" @keyup.enter.native="handleLogin()" clearable></el-input>
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
            const resultuser = data.some((value, index, data) => {
                return value.ename == this.formdata.username
            })
            const resultpwd = data.some((value, index, data) => {
                return value.ename == this.formdata.username && value.epassword == this.formdata.password
            })
            if (this.formdata.username == '') {
                this.$message.error('账号不能为空！')
            } else {
                if (!resultuser) {
                    this.$message.error('账号不存在！')
                } else {
                    if (this.formdata.password == '') {
                        this.$message.error('密码不能为空！')
                    } else {
                        if (!resultpwd) {
                            this.$message.error('密码不正确')
                        } else {
                            localStorage.setItem('user', this.formdata.username)
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
