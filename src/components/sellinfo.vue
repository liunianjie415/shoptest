<template>
<el-card class="box-card">
    <el-row class="">
        <el-col>
            <el-input placeholder="请输入账单编号" clearable class="sallsearchinput" v-model="query">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </el-col>
    </el-row>
    <el-table :data="tableData" border class="salltable">
        <el-table-column type="index" :index='indexMethod' label="#" width="100">
        </el-table-column>
        <el-table-column prop="seid" label="账单编号" width="200">
        </el-table-column>
        <el-table-column prop="sedate" label="销售日期" width="280">
        </el-table-column>
        <el-table-column prop="seeprice" label="结算金额">
        </el-table-column>
    </el-table>
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="PageSize"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
</template>

<script>
export default {
    data() {
        return {
             query: '',
            tableData: [],
            total: 0,
            PageSize: 6,
            currentPage: 1
        }
    },
    methods: {
        //获取序号
        indexMethod(index) {
            return (this.currentPage - 1) * this.PageSize + index + 1;
        },
        // 每页显示的条数
        handleSizeChange(val) {
            // 改变每页显示的条数 
            this.PageSize = val
            // 注意：在改变每页显示的条数时，要将页码显示到第一页
            this.currentPage = 1
        },
        // 显示第几页
        handleCurrentChange(val) {
            // 改变默认的页数
            this.currentPage = val
        },
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
  height: 475px;
  margin: 15px 0;
}
</style>
