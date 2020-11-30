<template>
<el-card class="box-card">
    <el-row class="stsearch">
        <el-col>
            <el-input placeholder="请输入搜索内容" clearable class="stsearchinput" v-model="query">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="success" class="gtaddbtn">添加商品</el-button>
        </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="#" width="60">
        </el-table-column>
        <el-table-column prop="" label="库存编号" width="100">
        </el-table-column>
        <el-table-column prop="" label="商品名称" width="180">
        </el-table-column>
        <el-table-column prop="" label="库存数量" width="100">
        </el-table-column>
        <el-table-column prop="" label="供应商编号" width="100">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="">
                <el-button type="primary" icon="el-icon-edit" circle plain></el-button>
                <el-button type="danger" icon="el-icon-delete" circle plain></el-button>
            </template>
        </el-table-column>
    </el-table>
     <el-pagination
     class="gpage"
      :current-page="1"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="2"
      layout="total, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
</el-card>
</template>

<script>
export default {
    methods: {
    },
    data() {
        return {
          query:'',
          tableData:[
            {},{},{},{},{},{}
          ]
        }
    }
}
</script>

<style>
.box-card {
  height: 100%;
}
.stsearch {
  margin: 15px 0;
}
.stsearchinput {
  width: 300px;
}
</style>
