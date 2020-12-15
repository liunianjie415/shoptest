<template>
<div style="height:535px">
    <el-col :span="16" style="height:100%" id="sell_ref">
    </el-col>
    <el-col :span="8">
        <el-table :data="this.transselldata" style="width: 100%; margin-left:10px" border>
            <el-table-column prop="gtname" label="类别名称" width="130">
            </el-table-column>
            <el-table-column prop="gtcount" label="销售总额" width="130">
            </el-table-column>
            <el-table-column label="销售详情">
                <template slot-scope="scope">
                    <el-button @click="showDetail(scope.row)" type="primary">商品占比</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-col>

    <el-dialog :visible.sync="dialogVisible" width="40%" :before-close="handleClose" @open="open()" custom-class="dialog">
        <template slot="title">
            <div style="color:white;font-weight:bolder;font-size:20px;border-bottom:1px solid white">商品占比</div>
        </template>
        <div style="height:400px;width:100%" id="sell_detail"></div>
    </el-dialog>
</div>
</template>

<script>
var echarts = require('echarts')
export default {
    name: 'chart-sell',
    props: {
        transselldata: {
            type: Array,
            default: () => []
        }
    },
    created() {
        this.$nextTick(() => {
            this.init()
        })
    },
    data() {
        return {
            chart: '',
            xData: [],
            yData: [],
            dialogVisible: false,
            dchart: '',
            detaille: [],
            detailse: []
        }
    },
    watch: {
        transselldata(value) {
            this.init()
        }
    },
    methods: {
        // 初始化图表
        async init() {
            if (this.chart != '' && this.chart != null && this.chart != undefined) {
                this.chart.dispose()
            }
            this.chart = echarts.init(document.getElementById('sell_ref'), 'dark')
            let len = this.transselldata.length
            this.xData = []
            this.yData = []
            for (let i = 0; i < len; i++) {
                this.xData.push(this.transselldata[i].gtname)
                this.yData.push(this.transselldata[i].gtcount)
            }
            this.setOptions()
        },
        // echarts柱状图的选项
        setOptions() {
            this.chart.setOption({
                xAxis: {
                    type: 'category',
                    data: this.xData
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: this.yData,
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            label: {
                                show: true, //开启显示
                                position: 'top', //在上方显示
                                textStyle: { //数值样式
                                    fontSize: 16
                                }
                            }
                        }
                    }
                }]
            })
        },
        // 查看详细信息
        showDetail(val) {
            this.dialogVisible = true
            let len = val.gdetail.length
            for (let i = 0; i < len; i++) {
                this.detaille.push(val.gdetail[i].gname)
                this.detailse.push({
                    value: val.gdetail[i].gcount,
                    name: val.gdetail[i].gname
                })
            }
            this.initPie()
        },
        handleClose() {
            this.dialogVisible = false
            this.detaille = []
            this.detailse = []
        },
        // 初始化饼图
        async initPie() {
            // 新建一个promise对象
            let newPromise = new Promise((resolve) => {
                resolve()
            })
            //然后异步执行echarts的初始化函数
            newPromise.then(() => {
                if (this.dchart != '' && this.dchart != null && this.dchart != undefined) {
                    this.dchart.dispose()
                }
                //	此dom为echarts图标展示dom
                this.dchart = echarts.init(document.getElementById('sell_detail'), 'dark')
                this.setPieOptions()
            })
        },
        // 饼图数据
        setPieOptions() {
            this.dchart.setOption({
                legend: {
                    orient: "vertical",
                    left: "left",
                    data: this.detaille
                },
                series: [{
                    type: "pie",
                    data: this.detailse,
                    itemStyle: {
                        shadowBlur: 4,
                        shadowColor: "white"
                    },
                    emphasis: {
                        label: {
                            fontSize: 20
                        }
                    }
                }],
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c} ({d}%)'
                }
            })
        },
        open() {
            this.$nextTick(() => {
                this.initPie()
            })
        }
    }
}
</script>

<style>
.dialog {
    background: #100C2A;
}
</style>
