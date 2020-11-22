<template>
<el-card class="box-card">
    <el-row class="gtsearch">
        <el-col>
            <el-input placeholder="请输入搜索内容" clearable class="gtsearchinput" v-model="query">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="success" class="gtaddbtn">添加类名</el-button>
        </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="#" width="60">
        </el-table-column>
        <el-table-column prop="" label="类别编号" width="100">
        </el-table-column>
        <el-table-column prop="" label="类别名称" width="160">
        </el-table-column>
        <el-table-column prop="" label="商品编号" width="400">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="">
                <el-button type="primary" icon="el-icon-edit" circle plain></el-button>
                <el-button type="danger" icon="el-icon-delete" circle plain></el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-row class="gtypebottom">
        <el-col>
            <el-button type="primary" icon="el-icon-back" circle></el-button>
            <el-button type="primary" icon="el-icon-right" circle></el-button>
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
.gtsearch {
  margin: 15px 0;
}
.gtsearchinput {
  width: 300px;
}
.gtypebottom {
  margin-top: 20px;
}
</style>
