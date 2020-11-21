<template>
<el-card class="box-card">
    <el-table :data="tableData" style="width: 100%" class="emptable">
        <el-table-column type="index" label="#" width="60">
        </el-table-column>
        <el-table-column prop="" label="员工编号" width="100">
        </el-table-column>
        <el-table-column prop="" label="员工名称" width="200">
        </el-table-column>
        <el-table-column prop="" label="入职时间" width="100">
        </el-table-column>
        <el-table-column prop="" label="离职时间" width="100">
        </el-table-column>
        <el-table-column prop="" label="员工权限" width="100">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="">
                <el-button type="primary" icon="el-icon-edit" circle plain></el-button>
                <el-button type="danger" icon="el-icon-delete" circle plain></el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-row class="empbottom">
        <el-col>
            <el-button type="primary" icon="el-icon-back" circle></el-button>
            <el-button type="primary" icon="el-icon-right" circle></el-button>
            <el-button type="success" class="empaddbtn">添加员工</el-button>
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

.emptable {
    height: 520px;
}
.empbottom {
    margin-top: 20px;
}
.empaddbtn {
    float: right;
}
</style>
