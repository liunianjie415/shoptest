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
            <span>选择类别：</span>
            <el-autocomplete clearable :fetch-suggestions="querygtypeSearch" v-model="goodstype" style="width:115px" @select="handleGtypeSelect" @clear="clearGtypeSelect" @focus="handleTypeFocus">
                <template slot-scope="{ item }">
                    <div>{{ item.value }}</div>
                </template>
            </el-autocomplete>
            <span>选择商品：</span>
            <el-autocomplete clearable :fetch-suggestions="querygnameSearch" v-model="goodsname" style="width:115px">
                <template slot-scope="{ item }">
                    <div>{{ item.value }}</div>
                </template>
            </el-autocomplete>
        </el-col>
        <el-col :span="7">
            <el-row style="margin-left:12px">
                <el-button type="primary" plain round @click="showSell">查看销量</el-button>
                <el-button type="primary" plain round @click="showStore">查看库存</el-button>
                <el-button type="primary" plain round @click="showIncome">查看利润</el-button>
            </el-row>
        </el-col>
    </el-row>
    <el-row>
        <sell v-if="switchid == 1" :transdata="transdata"></sell>
        <store v-if="switchid == 2" :transdata="transdata"></store>
        <income v-if="switchid == 3" :transdata="transdata"></income>
    </el-row>
</el-card>
</template>

<script>
import ChartSell from './chart-sell'
import ChartStore from './chart-store'
import ChartIncome from './chart-income'
export default {
    data() {
        return {
            // 需要传的数据
            transdata: {
                afterdate: '',
                beforedate: '',
                gtype: '',
                gname: '',
            },
            // 显示子组件的开关
            switchid: 1,
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
            // 处理后的类别信息
            allGtypeMsg: [],
            // 可选择的商品名称
            selectgname: [],
            // 所有添加balue后的商品信息
            allGoodsMsg: [],
            goodsname: '',
        }
    },
    components: {
        sell: ChartSell,
        store: ChartStore,
        income: ChartIncome
    },
    created() {
        this.getGoods()
        this.getGtype()
    },
    methods: {
        // 销售子组件
        showSell() {
            this.switchid = 1
            this.gettransdata()
        },
        // 库存子组件
        showStore() {
            this.switchid = 2
            this.gettransdata()
        },
        // 利润子组件
        showIncome() {
            this.switchid = 3
            this.gettransdata()
        },
        // 获取需要传的数据
        gettransdata() {
            this.transdata = {
                afterdate: '1',
                beforedate: '2',
                gtype: '3',
                gname: '4',
            }
        },
        // 获取商品名称
        async getGoods() {
            const res = await this.$http.get("showGoods");
            this.selectgname = res.data;
            let key = "value";
            for (let i = 0; i < this.selectgname.length; i++) {
                let value = this.selectgname[i].gname;
                this.selectgname[i][key] = value;
            }
            this.allGoodsMsg = this.selectgname
        },
        querygnameSearch(queryString, cb) {
            var selectgname = this.selectgname;
            var results = queryString ?
                selectgname.filter(this.createFilter(queryString)) :
                selectgname;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
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
        // 当选择类别名称时，限制商品的选择，没有选择类别名称（即清除类别名称）时，不限制商品的选择
        // 获取并处理类别表的信息
        async getGtype() {
            const res = await this.$http.get('showGoodstype')
            let data = res.data
            let resArr = []
            data.forEach(e => {
                for (let i = 0; i < resArr.length; i++) {
                    if (resArr[i].typename == e.gtname) {
                        resArr[i].goodsname.push({
                            value: e.gname
                        })
                        return
                    }
                }
                resArr.push({
                    typename: e.gtname,
                    goodsname: [{
                        value: e.gname
                    }]
                })
            })
            this.allGtypeMsg = resArr
        },
        // 处理选择类别名称后的事件
        handleGtypeSelect() {
            let type = this.goodstype
            let goods = []
            let len = this.allGtypeMsg.length
            for (let i = 0; i < len; i++) {
                if (type == this.allGtypeMsg[i].typename) {
                    this.selectgname = this.allGtypeMsg[i].goodsname
                }
            }
        },
        // 处理清除类别名称后的事件
        clearGtypeSelect() {
            this.selectgname = this.allGoodsMsg
        },
        // 如果选择了商品再选择类别会清空商品选择框
        handleTypeFocus() {
            if (this.goodstype == '' && this.goodsname != '') {
                this.goodsname = ''
            }
        },
    }
}
</script>

<style>
.box-card {
    height: 100%;
}
</style>
