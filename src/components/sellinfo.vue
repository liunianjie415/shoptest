<template>
<el-card class="box-card">
    <el-row>
        <el-col>
            <el-input placeholder="请输入账单编号" clearable class="sallsearchinput" v-model="query" @keyup.enter.native="searchevent">
                <el-button slot="append" icon="el-icon-search" @click="searchevent"></el-button>
            </el-input>
        </el-col>
    </el-row>
    <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border class="salltable">
        <el-table-column type="index" :index='indexMethod' label="#" width="100">
        </el-table-column>
        <el-table-column prop="senum" label="账单编号" width="160">
        </el-table-column>
        <el-table-column prop="sedate" label="销售日期" width="200">
        </el-table-column>
        <el-table-column prop="totalprice" label="结算金额/元" width="160">
        </el-table-column>
        <el-table-column label="销售详情">
            <template slot-scope="scope">
                <el-button @click="showDetail(scope.row)">详细信息</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 详细信息 -->
    <el-dialog title="详细信息" :visible.sync="dialogTableVisible" border width="46%" custom-class="details" :before-close="closeDialog">
        <el-table :data="form">
            <el-table-column property="gname" label="商品名称" width="160"></el-table-column>
            <el-table-column property="gspec" label="商品规格" width="140"></el-table-column>
            <el-table-column property="gcount" label="商品数量" width="100"></el-table-column>
            <el-table-column property="gbprice" label="未打折价格/元" width="120"></el-table-column>
            <el-table-column property="gprice" label="折后价格/元"></el-table-column>
        </el-table>
    </el-dialog>
</el-card>
</template>

<script>
import moment from 'moment'
export default {
    data() {
        return {
            query: '',
            tableData: [],
            total: 0,
            pageSize: 6,
            currentPage: 1,
            form: [],
            dialogTableVisible: false,
            // 商品规格
            gspec: [],
            curtable: []
        }
    },
    created() {
        this.getData()
        this.getGspec()
    },
    methods: {
        // 搜索账单
        searchevent() {
            let len = this.curtable.length
            if (this.query != '') {
                this.tableData = []
                let reg = new RegExp(this.query)
                for (let i = 0; i < len; i++) {
                    if (reg.test(this.curtable[i].senum)) {
                        this.tableData.push(this.curtable[i])
                    }
                }
                this.total = this.tableData.length
                this.currentPage = 1
            } else {
                this.tableData = this.curtable
                this.total = this.tableData.length
                this.currentPage = 1
            }
        },
        // 查看详细信息
        showDetail(val) {
            this.dialogTableVisible = true
            let len = val.gdetail.length
            for (let i = 0; i < len; i++) {
                this.form.push({
                    gname: val.gdetail[i].gname,
                    gcount: val.gdetail[i].gcount,
                    gbprice: val.gdetail[i].gbprice,
                    gprice: val.gdetail[i].gprice
                })
            }
            this.form.forEach((el) => {
                this.gspec.forEach((e) => {
                    if (el.gname == e.gname) {
                        el.gspec = e.gspec
                    }
                })
            })
        },
        closeDialog() {
            this.dialogTableVisible = false
            this.form = []
        },
        // 获取数据
        async getData() {
            const res = await this.$http.get('showSell')
            let data = res.data
            let len = data.length
            let dataArr = []
            for (let i = 0; i < len; i++) {
                dataArr[i] = {
                    senum: data[i].senum,
                    sedate: moment(data[i].sedate).format("YYYY-MM-DD HH:mm:ss"),
                    bprice: parseFloat(data[i].sebprice).toFixed(2).toString(),
                    price: parseFloat(data[i].seeprice).toFixed(2).toString(),
                    gname: data[i].uname,
                    gcount: data[i].secount
                }
            }
            let handleArr = []
            dataArr.forEach((el) => {
                for (let i = 0; i < handleArr.length; i++) {
                    if (handleArr[i].senum == el.senum) {
                        handleArr[i].gdetail.push({
                            gname: el.gname,
                            gcount: el.gcount,
                            gbprice: el.bprice,
                            gprice: el.price,
                        })
                        return
                    }
                }
                handleArr.push({
                    senum: el.senum,
                    sedate: el.sedate,
                    gdetail: [{
                        gname: el.gname,
                        gcount: el.gcount,
                        gbprice: el.bprice,
                        gprice: el.price
                    }]
                })
            })
            let finalArr = []
            handleArr.forEach((el) => {
                if (el.gdetail.length == 1) {
                    el.totalprice = el.gdetail[0].gprice
                } else {
                    let len = el.gdetail.length
                    el.totalprice = 0
                    for (let i = 0; i < len; i++) {
                        el.totalprice = (parseFloat(el.gdetail[i].gprice) + parseFloat(el.totalprice)).toFixed(2).toString()
                    }
                }
            })
            this.tableData = handleArr
            this.total = handleArr.length
            this.curtable = this.tableData
        },
        //获取序号
        indexMethod(index) {
            return (this.currentPage - 1) * this.pageSize + index + 1;
        },
        // 每页显示的条数
        handleSizeChange(val) {
            // 改变每页显示的条数 
            this.pageSize = val
            // 注意：在改变每页显示的条数时，要将页码显示到第一页
            this.currentPage = 1
        },
        // 显示第几页
        handleCurrentChange(val) {
            // 改变默认的页数
            this.currentPage = val
        },
        // 获取商品信息
        async getGspec() {
            const res = await this.$http.get('showGoods')
            let data = res.data
            let len = data.length
            for (let i = 0; i < len; i++) {
                this.gspec.push({
                    gname: data[i].gname,
                    gspec: data[i].gspec
                })
            }
        }
    }
}
</script>

<style>
.box-card {
    height: 100%;
}

.sallsearchinput {
    width: 300px;
}

.salltable {
    margin: 15px 0;
}

.details {
    height: 600px;
    overflow: auto;
}
</style>
