<template>
<el-card class="box-card">
    <el-table :data="tableData" class="billtable">
        <el-table-column type="index" label="#" width="60">
        </el-table-column>
        <el-table-column prop="" label="账号编号" width="100">
        </el-table-column>
        <el-table-column prop="" label="商品名称" width="160">
        </el-table-column>
        <el-table-column prop="" label="规格" width="100">
        </el-table-column>
        <el-table-column prop="" label="数量" width="100">
        </el-table-column>
        <el-table-column prop="" label="折扣编号" width="100">
        </el-table-column>
        <el-table-column prop="" label="总金额" width="100">
        </el-table-column>
        <el-table-column prop="" label="折后金额" width="100">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="">
                <el-button type="primary" icon="el-icon-edit"  plain></el-button>
                <el-button type="danger" icon="el-icon-delete"  plain></el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-row class="billbottom">
        <el-col>
          <el-button icon="el-icon-caret-left" class="billbtn"></el-button>
          <el-button icon="el-icon-caret-right" class="billbtn"></el-button>
          <el-button icon="el-icon-plus" class="billaddbtn"></el-button>
            <el-button type="primary" plain>确认</el-button>
        </el-col>
    </el-row>
</el-card>
</template>

<script>
export default {
    methods: {
    },
    data() {
        return {
          tableData:[
            {},{},{},{},{},{},{}
          ]
        }
    }
}
</script>

<style>
.box-card {
  height: 100%;
}
.billtable {
  height: 500px;
}
.billbottom {
  margin-top: 30px;
}
</style>
