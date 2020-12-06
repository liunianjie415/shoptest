<template>
<el-card class="box-card">
    <el-row style="margin-bottom:20px">
        
    </el-row>
    <el-row>
        <div id="sellcount" style="width:1200px;height:550px;"></div>
    </el-row>
</el-card>
</template>

<script>
var echarts = require('echarts')
export default {
    data() {
        return {
            // 从销售表得到的数据
            sellData: [],
            // 柱状图数据
            xData: [],
            yData: []
        }
    },
    created() {},
    mounted() {
        this.initecharts()
    },
    methods: {
        // 获取及处理数据
        async initecharts() {
            let myChart = echarts.init(document.getElementById('sellcount'))
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
