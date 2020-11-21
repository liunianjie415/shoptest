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
        <el-table-column type="index" label="#" width="100">
        </el-table-column>
        <el-table-column prop="" label="账单编号" width="200">
        </el-table-column>
        <el-table-column prop="" label="销售日期" width="280">
        </el-table-column>
        <el-table-column prop="" label="结算金额">
        </el-table-column>
    </el-table>
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="2"
      layout="total, prev, pager, next"
      :total="400">
    </el-pagination>
</el-card>
</template>

<script>
export default {
    methods: {
        handleClick(row) {
            console.log(row);
        },
        handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        }
    },
    data() {
        return {
            query: '',
            tableData: [{}, {}, {}, {}, {}, {}, {}, {}, {}]
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
  height: 475px;
  margin: 15px 0;
}
</style>
