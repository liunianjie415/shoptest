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
    <el-pagination class="gpage" @size-change="pageCount" @current-change="currentPage" layout="total, prev, pager, next, jumper" :total="totalPage" :page-size="pageCount">
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
        // async getGoodsList() {
        //     const res = await this.$http.get('showGoods')
        //     const data = res.data
        //     this.goodslist = data
        //     this.total = data.length
        // }

        //获取前6条数据
        getData(index) {
            this.pageNo = index || this.pageNo
            this.$http.post('showGoodsPage', {
                pagenum: this.pageNo,
                pagesize: this.pageCount
            }).then(res => {
                // console.log(res.data.data);
                this.tableData = res.data.data
            }).catch(error => {
                console.log(error);
            })
        },
        //当前页数据
        currentPage(currentPage) {
            this.currentNo = currentPage;
            // console.log(this.currentNo)
            this.getData(this.currentNo)
        },
        //获取序号
        indexMethod(index) {
            return (this.currentNo - 1) * this.pageCount + index + 1;
        },
        //获取总页数
        getPageTotal() {
            this.$http.get('showGoods').then(res => {
                // console.log(res.data)
                this.allData = res.data
                // console.log(this.allData.length === 10);
                this.totalPage = this.allData.length
                // Math.ceil (this.allData.length / this.pageCount) * 6
            }).catch(error => {
                console.log(error)
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
