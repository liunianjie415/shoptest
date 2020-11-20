<template>
<el-container class="container">
    <el-header class="header">
        <el-row style="height:60px">
            <el-col :span="3">
                <div class="grid-content bg-purple logo">
                    <img src="../../static/img/模型超市.png" alt="">
                </div>
            </el-col>
            <el-col :span="18" class="title">
                <div class="grid-content bg-purple-light">超市后台管理系统</div>
            </el-col>
            <el-col :span="3" class="loginout">
                <div class="grid-content bg-purple ">
                    <i class="el-icon-switch-button"></i>
                </div>
            </el-col>
        </el-row>
    </el-header>
    <el-container>
        <el-aside width="200px" class="aside">Aside</el-aside>
        <el-main class="main">Main</el-main>
    </el-container>
</el-container>
</template>

<script>
export default {

}
</script>

<style>
.container {
    height: 100%;
}

.header {
    /* background-color: #b3c0d1; */
    background-color: #487eb0;
}
.header .logo img{
    width: 50px;
    height: 50px;
}
.header .title {
    font-size: 36px;
    color: #fff;
    font-weight: bolder;
    text-shadow: 2px 2px 4px #f40;
    text-align: center;
}
.header .loginout {
    text-align: right;
    font-size: 40px;
    cursor: pointer;
    text-shadow: 2px 2px 3px red;
}
.aside {
    background-color: #dcdde1;
}

.main {
    background-color: #eee;
}
</style>
