<template>
<el-card class="box-card">
    <el-row>
        <el-col>
            <el-input placeholder="请输入账单编号" clearable class="sallsearchinput" v-model="query">
                <el-button slot="append" icon="el-icon-search"></el-button>
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
            <el-button>详细信息</el-button>
        </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
    </el-pagination>
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
            currentPage: 1
        }
    },
    created() {
        this.getData()
    },
    methods: {
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
</style>
