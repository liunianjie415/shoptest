<template>
<el-card class="box-card">
    <el-row>
        选择时间段：
        <el-date-picker v-model="afterdate" type="date" placeholder="选择日期">
        </el-date-picker>
        ~
        <el-date-picker v-model="beforedate" type="date" placeholder="选择日期">
        </el-date-picker>
        <el-button type="primary" class="confirmBtn" @click="checkShow">确认查看</el-button>
    </el-row>
    <el-row style="margin:5px;font-size:20px;color:red">
        <em>所有总商品销量：</em>
    </el-row>
    <el-row class="table">
        <el-table :data="tableData" height="500" border style="width: 100%;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)" :default-sort = "{prop: 'gname', order: 'descending'}">
            <el-table-column type="index" label="#" width="80">
            </el-table-column>
            <el-table-column prop="gname" label="商品名称" width="350">
            </el-table-column>
            <el-table-column prop="gspec" label="商品规格" width="350">
            </el-table-column>
            <el-table-column prop="gcount" label="销售数量" sortable>
            </el-table-column>
        </el-table>
    </el-row>
</el-card>
</template>

<script>
import moment from 'moment'
export default {
    data() {
        return {
            afterdate: '',
            beforedate: '',
            tableData: [],
            // 所有商品的信息
            goodsmsg: [],
            // 只包含出售信息的数组
            sellmsg: [],
            // 处理了数量后，添加上商品规格和售价的数组
            handlegoodsmsg: []
        }
    },
    created() {
        this.getData()
    },
    methods: {
        async getData() {
            const res = await this.$http.get('showGoods')
            // gname gspec gprice 
            this.goodsmsg = res.data
            // gname gcount date
            const storemsg = await this.$http.get('getSellStoreMsg')
            // 筛选出所有出售信息
            this.sellmsg = this.resSellMsg(storemsg.data)
            this.checkShow()
        },
        checkShow() {
            // 筛选在指定时间段内的出售信息      
            let handletimemsg = this.handleTimeMsg(this.sellmsg, this.afterdate, this.beforedate)
            // 处理数量的问题
            let handlecountmsg = this.handleCountMsg(handletimemsg)
            // 处理成需要的数组
            let resArr = this.handleGoodsMsg(handlecountmsg, this.goodsmsg)
            this.tableData = resArr
        },
        // 返回只包含出售信息数组
        resSellMsg(data) {
            let indata = data
            let len = indata.length
            var resArr = []
            for (let i = 0; i < len; i++) {
                if (indata[i].sdesc.slice(0, 2) == "出售") {
                    resArr.push(indata[i])
                }
            }
            return resArr
        },
        // 处理数组的时间
        handleTimeMsg(data, adate, bdate) {
            let afterDate = '',
                beforeDate = ''
            var resArr = []
            let len = data.length
            if ((adate == '' || adate == null) && (bdate == '' || bdate == null)) {
                resArr = this.sellmsg
            } else {
                if ((bdate == '' || bdate == null) && (adate != '' || adate != null)) {
                    afterDate = moment(adate).format('YYYY-MM-DD')
                    beforeDate = moment('2100-01-01').format('YYYY-MM-DD')
                } else if ((adate == '' || adate == null) && (bdate != '' || bdate != null)) {
                    afterDate = moment('1970-01-01').format('YYYY-MM-DD')
                    beforeDate = moment(bdate).format('YYYY-MM-DD')
                } else if ((bdate != '' || bdate != null) && (adate != '' || adate != null)) {
                    afterDate = moment(adate).format('YYYY-MM-DD')
                    beforeDate = moment(bdate).format('YYYY-MM-DD')
                }
                for (let i = 0; i < len; i++) {
                    if (this.checkTimeIn(afterDate, beforeDate, data[i].sdate)) {
                        resArr.push(data[i])
                    }
                }
            }
            return resArr
        },
        // 处理数量
        // gname gcount
        handleCountMsg(dataArr) {
            let countArr = []
            dataArr.forEach((e) => {
                for (let i = 0; i < countArr.length; i++) {
                    if (countArr[i].gname == e.sname) {
                        countArr[i].gcount = countArr[i].gcount + e.scountreduce
                        return
                    }
                }
                countArr.push({
                    gname: e.sname,
                    gcount: e.scountreduce,
                })
            })
            return countArr
        },
        // 返回处理了时间，数量后，添加上商品规格和售价
        // data1 --> 处理后的数组  data2 --> 所有的商品数据 (gname gspec gprice)
        handleGoodsMsg(data1, data2) {
            let data = data1
            let len = data.length
            for (let i = 0; i < len; i++) {
                data2.forEach((e) => {
                    if (data[i].gname == e.gname) {
                        data[i].gspec = e.gspec
                        data[i].gprice = parseFloat(e.gprice).toFixed(2)
                    }
                })
            }
            return data
        },
        // 判断是否在某时间内
        checkTimeIn(s, e, time) {
            s = moment(s).subtract(1, 'd').format('YYYY-MM-DD')
            e = moment(e).add(1, 'd').format('YYYY-MM-DD')
            let t = moment(time).format('YYYY-MM-DD')
            if (moment(t).diff(s) > 0 && moment(t).diff(e) < 0) {
                return true
            }
            return false
        },
    }
}
</script>

<style>
.box-card {
    height: 100%;
}

.table {
    margin-top: 10px;
}

.confirmBtn {
    margin-left: 20px;
}
</style>
