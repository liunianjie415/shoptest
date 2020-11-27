<template>
<el-card class="box-card">
    <el-row class="gsearch">
        <el-col>
            <el-input placeholder="请输入商品名称" clearable class="searchinput" v-model="query" @keyup.enter.native="goodsSearch">
                <el-button slot="append" icon="el-icon-search" @click="goodsSearch"></el-button>
            </el-input>
            <el-button type="success" class="addbtn" @click.prevent="addGoods">添加商品</el-button>
        </el-col>
    </el-row>
    <el-table :data="tableData" border style="width: 100%" class="gtable">
        <el-table-column type="index" :index='indexMethod' label="#" width="60">
        </el-table-column>
        <el-table-column prop="gid" label="商品编号" width="100">
        </el-table-column>
        <el-table-column prop="gname" label="商品名称" width="200">
        </el-table-column>
        <el-table-column prop="gspec" label="商品规格" width="150">
        </el-table-column>
        <el-table-column prop="gprice" label="商品价格/元" width="100">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="">
                <el-button type="primary" icon="el-icon-edit" circle plain></el-button>
                <el-button type="danger" icon="el-icon-delete" circle plain></el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination class="gpage" @size-change="pageCount" @current-change="currentPage" :current-page.sync="currentNo" layout="total, prev, pager, next, jumper" :total="totalPage" :page-size="pageCount">
    </el-pagination>
</el-card>
</template>

<script>
export default {
    data() {
        return {
            query: '',
            tableData: [], //当前页码表格数据
            pageNo: 1, //表格页码
            pageCount: 6, //数据数
            currentNo: 1, //当前页码
            allData: [], //全部数据
            totalPage: 0 //总页码
        }
    },
    created() {
        this.getData()
        this.getPageTotal()
    },
    methods: {
        //获取前6条数据
        async getData(index) {
            this.pageNo = index || this.pageNo
            const res = await this.$http.post('showGoodsPage', {
                pagenum: this.pageNo,
                pagesize: this.pageCount
            })
            this.tableData = res.data
        },
        //当前页数据
        currentPage() {
            this.getData(this.currentNo)
            this.getSearchData(this.currentNo)
            // console.log(this.currentNo)
        },
        //获取序号
        indexMethod(index) {
            return (this.currentNo - 1) * this.pageCount + index + 1;
        },
        //获取总页数及数据
        async getPageTotal() {
            const res = await this.$http.get('showGoods')
            this.allData = res.data
            this.totalPage = this.allData.length
        },
        // 搜索商品
        // 获取前6条
        async getSearchData(index) {
            this.pageNo = index || this.pageNo
            const res = await this.$http.post('searchGoods', {
                query: this.query,
                pagenum: this.pageNo,
                pagesize: this.pageCount
            })
            this.tableData = res.data
            // console.log(this.tableData);
        },
        // 获取搜索的总数据及总页数
        async getSearchPageTotal() {
            const res = await this.$http.post('searchGoods',{query:this.query})
            this.allData = res.data
            this.totalPage = this.allData.length
            // console.log(this.allData, this.totalPage);
        },
        // 搜索按钮
        goodsSearch() {
            this.currentNo = 1
            this.getSearchData()
            this.getSearchPageTotal()
            this.currentPage()
        },
        //添加商品
        addGoods() {
            this.$alert('<strong>这是 <i>HTML</i> 片段</strong>', '添加商品', {
                dangerouslyUseHTMLString: true
            })
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
