<template>
<el-container class="container">
    <el-header class="header">
        <el-row type="flex" justify="start" style="height:60px">
            <el-col :span="3">
                <img src="../../static/img/模型超市.png" alt="">
            </el-col>
            <el-col :span="18" class="hometitle">
                超市后台管理系统
            </el-col>
            <el-col :span="3" class="loginout">
                <i class="el-icon-switch-button"></i>
            </el-col>
        </el-row>
    </el-header>
    <el-container>
        <el-aside width="200px" class="aside">
            <el-menu
            unique-opened
            default-active="ginfo"
            router>
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-goods"></i>
                        <span>商品管理</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="ginfo">
                            <i class="el-icon-s-grid"></i>
                            <span>商品信息</span>
                        </el-menu-item>
                        <el-menu-item index="gtype">
                            <i class="el-icon-s-grid"></i>
                            <span>商品类别</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item index="store">
                    <i class="el-icon-box"></i>
                    <span slot="title">库存管理</span>
                </el-menu-item>
                <el-menu-item index="provide">
                    <i class="el-icon-document"></i>
                    <span slot="title">供应商管理</span>
                </el-menu-item>
                <el-submenu index="4">
                    <template slot="title">
                        <i class="el-icon-user"></i>
                        <span>员工管理</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="einfo">
                            <i class="el-icon-s-grid"></i>
                            <span>员工信息</span>
                        </el-menu-item>
                        <el-menu-item index="eauth">
                            <i class="el-icon-s-grid"></i>
                            <span>员工权限</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="5">
                    <template slot="title">
                        <i class="el-icon-sell"></i>
                        <span>销售管理</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="sinfo">
                            <i class="el-icon-s-grid"></i>
                            <span>销售信息</span>
                        </el-menu-item>
                        <el-menu-item index="sstat">
                            <i class="el-icon-s-grid"></i>
                            <span>统计报表</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                
                <el-menu-item index="disc">
                    <i class="el-icon-discount"></i>
                    <span slot="title">优惠管理</span>
                </el-menu-item>
                <el-menu-item index="bills">
                    <i class="el-icon-setting"></i>
                    <span slot="title">消费管理</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-main class="main">
            <router-view>
                <router-link :to="{path:'ginfo'}"></router-link>
            </router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
  data () {
    return {

    }
  }
}
</script>

<style>
.container {
    height: 100%;
}

.header {
    /* background-color: deepskyblue; */
    background:linear-gradient(to right, blueviolet, deepskyblue)
}

.header .logo img {
    width: 50px;
    height: 50px;
}

.header .hometitle {
    font-size: 40px;
    color: #fff;
    font-weight: bolder;
    text-shadow: 5px 5px 7px #f40;
    text-align: center;
}

.header .loginout {
    font-size: 40px;
    cursor: pointer;
    text-shadow: 2px 2px 3px red;
    color: blueviolet;
    text-align: right;
}

.aside {
    background-color: #dcdde1;
}

.main {
    background-color: #eee;
}
</style>
