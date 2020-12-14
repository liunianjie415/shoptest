<template>
<el-card class="box-card">
    <el-row style="margin-bottom:10px">
        <el-col :span="10">
            选择时间段：
            <el-date-picker v-model="afterdate" type="date" placeholder="选择日期" style="width:150px" :disabled=flag>
            </el-date-picker>
            ~
            <el-date-picker v-model="beforedate" type="date" placeholder="选择日期" style="width:150px" :disabled=flag>
            </el-date-picker>
        </el-col>
        <el-col :span="6">
            <span>选择类别：</span>
            <el-autocomplete clearable :fetch-suggestions="querygtypeSearch" v-model="goodstype" style="width:115px">
                <template slot-scope="{ item }">
                    <div>{{ item.value }}</div>
                </template>
            </el-autocomplete>
        </el-col>
        <el-col :span="8">
            <el-row>
                <el-button type="primary" plain round @click="showSell">查看销量</el-button>
                <el-button type="primary" plain round @click="showStore">库存剩余</el-button>
                <el-button type="primary" plain round @click="showIncome">利润情况</el-button>
            </el-row>
        </el-col>
    </el-row>
    <el-row>
        <sell v-if="switchid == 1" :transselldata="transselldata"></sell>
        <store v-if="switchid == 2" :transstoredata="transstoredata"></store>
        <income v-if="switchid == 3"></income>
        <div v-if="switchid == 4">
            请选择条件
        </div>
    </el-row>
</el-card>
</template>

<script>
import ChartSell from './chart-sell'
import ChartStore from './chart-store'
import ChartIncome from './chart-income'
import moment from 'moment'
export default {
    data() {
        return {
            // 需要传递的库存数据 类别名+其数量  商品名+其数量
            transstoredata:[],
            // 选择库存后，让时间选择控件失效
            flag: false,
            // 需要传递的销售数据 类别名+其数量  商品名+其数量
            transselldata: [],
            // 显示子组件的开关
            switchid: 4,
            // 日期
            afterdate: '',
            beforedate: '',
            // 所有可选择的类别名称
            selectgtype: [{
                "value": "食品类"
            }, {
                "value": "日用品类"
            }, {
                "value": "文具类"
            }, {
                "value": "水果类"
            }, {
                "value": "饮料类"
            }, {
                "value": "其他类"
            }],
            goodstype: '',
            // 类别表的数据
            allTgoods: [],
            // 商品名，数量，所属类别
            selldata: [],
            // 类别名，类别的销售总数量
            selltypedata: [],
            // 库存表的数据
            storedata:[],
            // 类别名，类别的库存总数量
            storetype:[]
        }
    },
    components: {
        sell: ChartSell,
        store: ChartStore,
        income: ChartIncome
    },
    created() {
        this.getGtype()
        this.getSellData()
        this.getStoreData()
    },
    methods: {
        // 销售子组件
        showSell() {
            this.switchid = 1
            if (this.flag == true) {
                this.flag = false
            }
            let sell = this.selldata
            // 在指定时间内的
            let after = (this.afterdate != null && this.afterdate != '') ? moment(this.afterdate).format('YYYY-MM-DD') : ''
            let before = (this.beforedate != null && this.beforedate != '') ? moment(this.beforedate).format('YYYY-MM-DD') : ''
            sell = this.handleTimeMsg(sell, after, before)
            // 处理数量
            sell = this.handleCountMsg(sell)
            // 添加类别名称
            sell = this.handleGoodsTypeMsg(sell, this.allTgoods)
            // 类别名 + 类别总数量
            this.selltypedata = this.statisticsType(sell)
            // 指定类别的处理
            let res = []
            if (this.goodstype != '') {
                this.selltypedata = this.assignGtype(this.selltypedata, this.goodstype)
                sell = this.assignGtype(sell, this.goodstype)
                res = this.sellFinallHandle(this.selltypedata, sell)
            } else {
                res = this.sellFinallHandle(this.selltypedata, sell)
            }
            // 所需传到子组件的数据
            this.transselldata = res
            // 重置条件
            sell = this.selldata
        },
        // 库存子组件
        showStore() {
            this.switchid = 2
            this.flag = true
            // 库存的信息
            let store = this.storedata
            // 库存信息添加商品的类别名  商品名，类别名，商品库存数量
            let len = store.length
            for(let i = 0; i < len; i++) {
                store[i].gname = store[i].ugname
            }
            store = this.handleGoodsTypeMsg(store, this.allTgoods)
            for(let i = 0; i < store.length; i++) {
                store[i].gcount = store[i].scount
            }
            // 类别名 + 类别库存总数量
            this.storetype = this.statisticsType(store)
            // 指定类别的处理
            let res = []
            if (this.goodstype != '') {
                this.storetype = this.assignGtype(this.storetype, this.goodstype)
                store = this.assignGtype(store, this.goodstype)
                res = this.sellFinallHandle(this.storetype, store)
            } else {
                res = this.sellFinallHandle(this.storetype, store)
            }
            // 所需传递到子组件的数据
            this.transstoredata = res
            // 重置条件
            store = this.storedata
        },
        // 利润子组件
        showIncome() {
            this.switchid = 3
            if (this.flag == true) {
                this.flag = false
            }
        },
        // 获取库存信息
        async getStoreData(){
            const res = await this.$http.get('showStore')
            this.storedata = res.data
        },
        // 类别名过滤
        createFilter(queryString) {
            return (item) => {
                return item.value.toUpperCase().match(queryString.toUpperCase());
            };
        },
        // 类别名称的选择
        querygtypeSearch(queryString, cb) {
            var selectgtype = this.selectgtype;
            var results = queryString ?
                selectgtype.filter(this.createFilter(queryString)) :
                selectgtype;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        // 获取类别表的信息
        async getGtype() {
            const res = await this.$http.get('showGoodstype')
            let data = res.data
            this.allTgoods = data
        },

        // 获取销售数据
        async getSellData() {
            const {
                data: ret
            } = await this.$http.get('getSellStoreMsg')
            this.selldata = ret
            // 只包含出售信息的
            this.selldata = this.resSellMsg(this.selldata)
        },
        // 只包含出售信息数组
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
            if (adate == '' && bdate == '') {
                resArr = data
            } else {
                if (bdate == '' && adate != '') {
                    afterDate = moment(adate).format('YYYY-MM-DD')
                    beforeDate = moment('2100-01-01').format('YYYY-MM-DD')
                } else if (adate == '' && bdate != '') {
                    afterDate = moment('1970-01-01').format('YYYY-MM-DD')
                    beforeDate = moment(bdate).format('YYYY-MM-DD')
                } else if (bdate != '' && adate != '') {
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
        // 添加上商品的类别名称
        handleGoodsTypeMsg(data1, data2) {
            let data = data1
            let len = data.length
            for (let i = 0; i < len; i++) {
                data2.forEach((e) => {
                    if (data[i].gname == e.gname) {
                        data[i].gtname = e.gtname
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
        // 统计类别的总数量
        statisticsType(data) {
            let len = data.length
            let res = []
            data.forEach(e => {
                for (let i = 0; i < res.length; i++) {
                    if (res[i].gtname == e.gtname && e.gtname != null) {
                        res[i].count = res[i].count + e.gcount
                        return
                    }
                }
                res.push({
                    gtname: e.gtname,
                    count: e.gcount
                })
            })
            return res
        },
        // 处理为类别名 + 总数量 + 包含商品的名称及其数量 data1 -- 类别名gtname + 总数量count   data2 -- 商品名gname 类别名gtname 数量gcount
        // 返回 [{gtname, gtcount, gdetail:[{gname,gcount}]}]
        sellFinallHandle(data1, data2) {
            let res = []
            // 先将data1的总数量加到data2上
            data2.forEach(e => {
                data1.forEach(el => {
                    if (e.gtname == el.gtname) {
                        e.gtcount = el.count
                    }
                })
            })
            // 再处理data2
            data2.forEach(e => {
                for (let i = 0; i < res.length; i++) {
                    if (res[i].gtname == e.gtname) {
                        res[i].gdetail.push({
                            gname: e.gname,
                            gcount: e.gcount
                        })
                        return
                    }
                }
                res.push({
                    gtname: e.gtname,
                    gtcount: e.gtcount,
                    gdetail: [{
                        gname: e.gname,
                        gcount: e.gcount
                    }]
                })
            })
            return res
        },
        // 指定类别
        assignGtype(data, type) {
            let res = []
            let len = data.length
            for (let i = 0; i < len; i++) {
                if (data[i].gtname == type) {
                    res.push(data[i])
                }
            }
            return res
        }
    }
}
</script>

<style>
.box-card {
    height: 100%;
}
</style>
