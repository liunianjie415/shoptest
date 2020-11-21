<template>
<el-card class="box-card">
    <el-row class="gsearch">
        <el-col>
            <el-input placeholder="请输入搜索内容" clearable class="searchinput" v-model="query">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="success" class="addbtn">添加商品</el-button>
        </el-col>
    </el-row>
    <el-table :data="tableData" border style="width: 100%" class="gtable">
        <el-table-column type="index" label="#" width="60">
        </el-table-column>
        <el-table-column prop="" label="商品编号" width="100">
        </el-table-column>
        <el-table-column prop="" label="商品名称" width="200">
        </el-table-column>
        <el-table-column prop="" label="商品规格" width="100">
        </el-table-column>
        <el-table-column prop="" label="商品价格" width="100">
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
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
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
            tableData: [{}, {}, {}, {}, {}, {}]
        }
    }
}
</script>

<style>
.box-card {
    height: 100%;
}

.searchinput {
    width: 300px;
}

.gtable {
    margin-top: 15px;
}

.gsearch {
    margin-top: 15px;
}

.gpage {
    margin-top: 15px;
}
</style>
