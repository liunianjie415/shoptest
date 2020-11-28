<template>
<el-card class="box-card">
    <el-row class="gtsearch">
        <el-col>
            <el-input placeholder="请输入类别名称" clearable class="gtsearchinput" v-model="query">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="success" class="gtaddbtn">添加数据</el-button>
        </el-col>
    </el-row>
    <el-table :data="tableData.slice((currentPage-1)*PageSize,currentPage*PageSize)" style="width: 100%">
        <el-table-column type="index" :index='indexMethod' label="#" width="60">
        </el-table-column>
        <el-table-column prop="gtid" label="类别编号" width="100">
        </el-table-column>
        <el-table-column prop="gtname" label="类别名称" width="160">
        </el-table-column>
        <el-table-column prop="gname" label="商品名称" width="400">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="">
                <el-button type="primary" icon="el-icon-edit" circle plain></el-button>
                <el-button type="danger" icon="el-icon-delete" circle plain></el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination class="gtypebottom" layout="prev, pager, next" :total="total" :page-size="PageSize" :current-page="currentPage" @size-change="handleSizeChange" @current-change="handleCurrentChange">
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
    created() {
        this.getData()
    },
    methods: {
        // 获得所有分类数据
        async getData() {
            const res = await this.$http.get('showGoodstype')
            this.tableData = res.data
            this.total = this.tableData.length
        },
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
