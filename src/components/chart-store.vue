<template>
<div style="height:535px">
    <el-col :span="16" style="height:100%" id="store_ref">
    </el-col>
    <el-col :span="8" style="height:100%">
        <el-table :data="this.transstoredata" style="width: 100%;margin-left:10px" border>
            <el-table-column prop="gtname" label="类别名称" width="130">
            </el-table-column>
            <el-table-column prop="gtcount" label="类别总库存" width="130">
            </el-table-column>
            <el-table-column label="详细商品库存">
                <template slot-scope="scope">
                    <el-button @click="showDetail(scope.row)" icon="el-icon-info" type="primary"></el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-col>

    <el-dialog :visible.sync="dialogVisible" width="65%" @open="open()" :before-close="handleClose" custom-class="dialogStore">
        <template slot="title">
            <div style="color:white;font-weight:bolder;font-size:20px;border-bottom:1px solid white">{{storetypetitle}}</div>
        </template>
        <div style="height:400px;width:100%" id="store_detail"></div>
    </el-dialog>
</div>
</template>

<script>
var echarts = require('echarts')
import 'echarts/theme/dark'
export default {
    name: 'chart-store',
    props: {
        transstoredata: {
            type: Array,
            default: () => []
        }
    },
    created() {
        this.$nextTick(() => {
            this.init()
        })
    },
    watch: {
        transstoredata(value) {
            this.init()
        }
    },
    data() {
        return {
            chart: '',
            xData: [],
            yData: [],
            dchart: '',
            detailX: [],
            detailY: [],
            dialogVisible: false,
            storetypetitle:''
        }
    },
    methods: {
        // 初始化图表
        async init() {
            if (this.chart != '' && this.chart != null && this.chart != undefined) {
                this.chart.dispose()
            }
            this.chart = echarts.init(document.getElementById('store_ref'), 'dark')
            let len = this.transstoredata.length
            this.xData = []
            this.yData = []
            for (let i = 0; i < len; i++) {
                this.xData.push(this.transstoredata[i].gtname)
                this.yData.push(this.transstoredata[i].gtcount)
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
                    type: 'value',
                    nameLocation: "start",
                    nameTextStyle:{
                        align:'left'
                    },
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
        // 详细商品库存
        showDetail(val) {
            this.storetypetitle = val.gtname
            this.dialogVisible = true
            let len = val.gdetail.length
            for (let i = 0; i < len; i++) {
                this.detailX.push(val.gdetail[i].gname)
                this.detailY.push({
                    value: val.gdetail[i].gcount,
                    name: val.gdetail[i].gname
                })
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
                this.dchart = echarts.init(document.getElementById('store_detail'), 'dark-fresh-cut')
                this.setBarOptions()
            })
        },
        // 详细信息的柱状图数据
        setBarOptions() {
            this.dchart.setOption({
                xAxis: {
                    type: 'value',
                },
                yAxis: {
                    type: 'category',
                    data: this.detailX
                },
                tooltip:{
                    trigger:'axis'
                },
                series: [{
                    data: this.detailY,
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'right',
                                textStyle: {
                                    fontSize: "16",
                                    color: "#fff",
                                    fontWeight:"bolder"
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
.dialogStore {
    background: #100C2A;
}
</style>
