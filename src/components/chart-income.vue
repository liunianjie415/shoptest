<template>
<div style="height:535px">
    <el-col :span="16" style="height:100%" id="income_ref">
    </el-col>
    <el-col :span="8" style="height:100%">
        <el-table :data="this.transincomedata" style="width: 100%;margin-left:10px" border>
            <el-table-column prop="gtname" label="类别名称" width="130">
            </el-table-column>
            <el-table-column prop="totalincome" label="利润总额/元" width="130">
            </el-table-column>
            <el-table-column label="详细商品利润">
                <template slot-scope="scope">
                    <el-button @click="showDetail(scope.row)" icon="el-icon-warning-outline" type="primary"></el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-col>

    <el-dialog :visible.sync="dialogVisible" width="40%" :before-close="handleClose" @open="open()" custom-class="dialogIncome">
        <template slot="title">
            <div style="color:white;font-weight:bolder;font-size:20px;border-bottom:1px solid white">{{incometypetitle}}商品的利润</div>
        </template>
        <div style="height:400px;width:100%" id="income_detail"></div>
    </el-dialog>
</div>
</template>

<script>
var echarts = require('echarts')
export default {
    name: 'chart-income',
    props: {
        transincomedata: {
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
            detailX: [],
            detailY: [],
            incometypetitle: ''
        }
    },
    watch: {
        transincomedata(value) {
            this.init()
        }
    },
    methods: {
        // 初始化图表
        async init() {
            if (this.chart != '' && this.chart != null && this.chart != undefined) {
                this.chart.dispose()
            }
            this.chart = echarts.init(document.getElementById('income_ref'), 'dark')
            let len = this.transincomedata.length
            this.xData = []
            this.yData = []
            for (let i = 0; i < len; i++) {
                this.xData.push(this.transincomedata[i].gtname)
                this.yData.push(this.transincomedata[i].totalincome)
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
                                formatter: "{c}" + "￥",
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
        // 详细利润
        showDetail(val) {
            this.incometypetitle = val.gtname
            this.dialogVisible = true
            let len = val.gdetail.length
            for (let i = 0; i < len; i++) {
                this.detailX.push(val.gdetail[i].gname)
                this.detailY.push(val.gdetail[i].income)
            }
            this.initBar()
        },
        handleClose() {
            this.dialogVisible = false
            this.detailX = []
            this.detailY = []
        },
        // 初始化详细信息
        async initBar() {
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
                this.dchart = echarts.init(document.getElementById('income_detail'))
                this.setBarOptions()
            })
        },
        // 详细信息的柱状图数据
        setBarOptions() {
            this.dchart.setOption({
                xAxis: {
                    type: 'category',
                    data: this.detailX,
                    axisLabel: {
                        interval: 0, //代表显示所有x轴标签显示
                        rotate: 45, //代表逆时针旋转45度
                    }
                },
                yAxis: {
                    type: 'value'
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: "{b}<br />{c}" + "￥"
                },
                series: [{
                    data: this.detailY,
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            label: {
                                formatter: "{c}" + "￥",
                                show: true,
                                position: 'top',
                                textStyle: {
                                    fontSize: "16",
                                    color: "#fff",
                                    fontWeight: "bolder"
                                }
                            }
                        }
                    }
                }]
            })
        },
        open() {
            this.$nextTick(() => {
                this.initBar()
            })
        }
    }
}
</script>

<style>
.dialogIncome {
    background-color: #100C2A;
}
</style>
