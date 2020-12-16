<template>
<el-container class="container">
    <el-header class="header">
        <el-row type="flex" justify="start" style="height:60px">
            <el-col :span="3">
                <img src="../../static/img/模型超市.png" alt="">
            </el-col>
            <el-col :span="15" class="hometitle">
                超市后台管理系统
            </el-col>
            <el-col :span="4">
                <div style="font-size: 22px;color: white;font-weight: bolder;margin: 15px 0;">当前用户：<span style="color:purple">{{username}}</span></div>
            </el-col>
            <el-col :span="2" class="loginout">
                <i class="el-icon-switch-button" @click.prevent="handlelogout()"></i>
            </el-col>
        </el-row>
    </el-header>
    <el-container>
        <el-aside width="205px" class="aside">
            <el-menu unique-opened default-active="ginfo" router background-color="#2f3640" text-color="#fff" active-text-color="#8c7ae6">
                <el-submenu index="1" :disabled="goodsEnable">
                    <template slot="title">
                        <i class="el-icon-goods"></i>
                        <span>商品管理</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="ginfo">
                            <i class="el-icon-s-grid"></i>
                            <span>商品信息</span>
                        </el-menu-item>
                        <el-menu-item index="gtype" :disabled="goodsonRead">
                            <i class="el-icon-s-grid"></i>
                            <span>商品类别</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item index="store" :disabled="storeEnable">
                    <i class="el-icon-box"></i>
                    <span slot="title">库存管理</span>
                </el-menu-item>
                <el-menu-item index="provide" :disabled="proEnable">
                    <i class="el-icon-document"></i>
                    <span slot="title">供应商管理</span>
                </el-menu-item>
                <el-menu-item index="einfo" :disabled="empEnable">
                    <i class="el-icon-user"></i>
                    <span slot="title">员工管理</span>
                </el-menu-item>
                <el-submenu index="5" :disabled="sellEnable">
                    <template slot="title">
                        <i class="el-icon-sell"></i>
                        <span>销售管理</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="sout">
                            <i class="el-icon-s-grid"></i>
                            <span>销量记录</span>
                        </el-menu-item>
                        <el-menu-item index="sstat">
                            <i class="el-icon-s-grid"></i>
                            <span>统计图表</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item index="disc" :disabled="disEnable">
                    <i class="el-icon-discount"></i>
                    <span slot="title">优惠管理</span>
                </el-menu-item>
                <el-submenu index="7" :disabled="billEnable">
                    <template slot="title">
                        <i class="el-icon-setting"></i>
                        <span>消费管理</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="sinfo">
                            <i class="el-icon-s-grid"></i>
                            <span>查看账单</span>
                        </el-menu-item>
                        <el-menu-item index="bills">
                            <i class="el-icon-s-grid"></i>
                            <span>生成账单</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
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
    beforeCreate() {
        const user = localStorage.getItem('user')
        if (!user) {
            this.$router.push({
                name: 'login'
            })
        }
    },
    data() {
        return {
            username: '',
            authorise: '',
            goodsEnable: true,
            storeEnable: true,
            proEnable: true,
            empEnable: true,
            sellEnable: true,
            disEnable: true,
            billEnable: true,
            goodsonRead: false
        }
    },
    created() {
        this.username = localStorage.getItem('user')
        this.authorise = localStorage.getItem('authorise')
        this.judgeauth(this.authorise)
    },
    methods: {
        // 判断权限
        judgeauth(auth) {
            let flag = auth
            switch (flag) {
                case "普通员工":
                    this.goodsEnable = false
                    this.billEnable = false
                    break;
                case "进货管理员":
                    this.goodsEnable = false
                    this.storeEnable = false
                    this.proEnable = false
                    this.sellEnable = false
                    this.goodsonRead = true
                    break;
                case "折扣管理员":
                    this.goodsEnable = false
                    this.disEnable = false
                    this.sellEnable = false
                    this.goodsonRead = true
                    break;
                default:
                    this.goodsEnable = false
                    this.storeEnable = false
                    this.proEnable = false
                    this.empEnable = false
                    this.sellEnable = false
                    this.disEnable = false
                    this.billEnable = false
            }
        },
        // 退出
        handlelogout() {
            localStorage.clear()
            this.$message.success('退出成功')
            this.$router.push({
                name: 'login'
            })
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
    background: linear-gradient(to right, blueviolet, deepskyblue)
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
    background-color: #dcdde1;
}
</style>
