<template>
<el-card class="box-card">
    <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="#" width="60">
        </el-table-column>
        <el-table-column prop="" label="折扣编号" width="80">
        </el-table-column>
        <el-table-column prop="" label="折扣名称" width="140">
        </el-table-column>
        <el-table-column prop="" label="商品编号" width="80">
        </el-table-column>
        <el-table-column prop="" label="商品名称" width="140">
        </el-table-column>
        <el-table-column prop="" label="打折力度" width="140">
        </el-table-column>
        <el-table-column prop="" label="起始时间" width="80">
        </el-table-column>
        <el-table-column prop="" label="结束时间" width="80">
        </el-table-column>
        <el-table-column prop="" label="状态" width="100">
        </el-table-column>
        <el-table-column label="操作">
            <el-button type="danger">修改</el-button>
        </el-table-column>
    </el-table>
    <el-row class="disbottom">
        <el-col>
          <el-button icon="el-icon-caret-left" circle class="pagebtn"></el-button>
          <el-button icon="el-icon-caret-right" circle class="pagebtn"></el-button>
          <el-button type="primary" class="disaddbtn">添加新折扣</el-button>
        </el-col>
    </el-row>
</el-card>
</template>

<script>
export default {
    methods: {},
    data() {
        return {
            tableData: [{}, {}, {}, {}, {}, {}, {}]
        }
    }
}
</script>

<style>
.box-card {
  height: 100%;
}

.disbottom {
  overflow: hidden;
  margin-top: 20px;
}
.disbottom .pagebtn {
  font-size: 24px;
}
.disbottom .disaddbtn {
  float: right;
}
</style>
