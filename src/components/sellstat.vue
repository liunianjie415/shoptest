<template>
<el-card class="box-card">
    <el-row style="margin-bottom:10px">
        <el-col :span="9">
            选择时间段：
            <el-date-picker v-model="afterdate" type="date" placeholder="选择日期" style="width:150px">
            </el-date-picker>
            ~
            <el-date-picker v-model="beforedate" type="date" placeholder="选择日期" style="width:150px">
            </el-date-picker>
        </el-col>
        <el-col :span="8">
            <el-col :span="12">选择类别：<el-input style="width:100px"></el-input>
            </el-col>
            <el-col :span="12">选择商品：<el-input style="width:100px"></el-input>
            </el-col>
        </el-col>
        <el-col :span="7">
            <el-col :span="8">
                <el-button>查看销量</el-button>
            </el-col>
            <el-col :span="8">
                <el-button>查看利润</el-button>
            </el-col>
            <el-col :span="8">
                <el-button>查看库存</el-button>
            </el-col>
        </el-col>
    </el-row>
    <el-row style="border:1px solid black;">
        <div id="myChart" style="width:100%;height:535px;"></div>
    </el-row>
</el-card>
</template>

<script>
var echarts = require('echarts')
export default {
    data() {
        return {
            afterdate: '',
            beforedate: '',
            // 从销售表得到的数据
            sellData: [],
            // 柱状图数据
            xData: [],
            yData: []
        }
    },
    mounted() {
        this.initecharts()
    },
    methods: {
        // 获取及处理数据
        async initecharts() {
            const res = await this.$http.get('showSell')
            this.sellData = res.data
            let data = res.data
            let len = data.length
            let curpieData = []
            for (let i = 0; i < len; i++) {
                curpieData[i] = {
                    gname: data[i].uname,
                    gcount: data[i].secount
                }
            }
            let handlecurxy = []
            curpieData.forEach((el) => {
                for (let i = 0; i < handlecurxy.length; i++) {
                    if (handlecurxy[i].gname == el.gname) {
                        handlecurxy[i] = {
                            gname: el.gname,
                            gcount: el.gcount + handlecurxy[i].gcount
                        }
                        return
                    }
                }
                handlecurxy.push({
                    gname: el.gname,
                    gcount: el.gcount
                })
            })
            let xylen = handlecurxy.length
            for (let i = 0; i < xylen; i++) {
                this.xData[i] = handlecurxy[i].gname
                this.yData[i] = handlecurxy[i].gcount
            }
            let myChart = echarts.init(document.getElementById('myChart'))
            let option = {
                title: {
                    text: '商品销量'
                },
                tooltip: {},
                legend: {
                    data: ['销量']
                },
                grid: {
                    bottom: "30%"
                },
                xAxis: {
                    data: this.xData,
                    axisLabel: {
                        interval: 0,
                        rotate: 40,
                        fontSize: 16
                    }
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: this.yData
                }]
            }
            myChart.setOption(option)
        }
    }
}
</script>

<style>
.box-card {
    height: 100%;
}
</style>
