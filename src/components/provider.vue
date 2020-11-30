<template>
<el-card class="box-card">
    <el-row class="stsearch">
        <el-col>
            <el-autocomplete clearable class="stsearchinput" v-model="query" :fetch-suggestions="querySearch" placeholder="请输入供应商名称" :trigger-on-focus="false">
                <template slot-scope="{ item }">
                    <div>{{ item.value }}</div>
                </template>
                <el-button slot="append" icon="el-icon-search" @click="searchevent"></el-button>
            </el-autocomplete>
            <el-button type="success" class="gtaddbtn">添加供应商</el-button>
        </el-col>
    </el-row>
    <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%">
        <el-table-column type="index" :index='indexMethod' label="#" width="60">
        </el-table-column>
        <el-table-column prop="pid" label="供应商编号" width="100">
        </el-table-column>
        <el-table-column prop="pname" label="供应商名称" width="200">
        </el-table-column>
        <el-table-column prop="paddr" label="供应商地址" width="270">
        </el-table-column>
        <el-table-column prop="ptel" label="供应商电话" width="160">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="">
                <el-button type="primary" icon="el-icon-edit" circle plain></el-button>
                <el-button type="danger" icon="el-icon-delete" circle plain></el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination class="gpage" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
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
            pageSize: 6,
            currentPage: 1,
            selectname: [],
        }
    },
    created() {
        this.getData()
    },
    methods: {
        // 搜索
        async searchevent() {
            const res = await this.$http.post('searchPro', {
                query: this.query
            })
            this.tableData = res.data
            this.total = this.tableData.length
            this.currentPage = 1
        },
        querySearch(queryString, cb) {
            var selectname = this.selectname;
            var results = queryString ? selectname.filter(this.createFilter(queryString)) : selectname;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (item) => {
                return item.value.toUpperCase().match(queryString.toUpperCase());
            }
        },
        // 获取数据
        async getData() {
            const res = await this.$http.get('showProvider')
            this.tableData = res.data
            this.total = this.tableData.length
            for (let i = 0; i < this.tableData.length; i++) {
                this.selectname[i] = this.tableData[i]
                let key = "value"
                let value = this.selectname[i].pname
                this.selectname[i][key] = value
            }
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

.stsearch {
    margin: 15px 0;
}

.stsearchinput {
    width: 300px;
}
</style>
