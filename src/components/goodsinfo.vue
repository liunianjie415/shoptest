<template>
<el-card class="box-card">
    <el-row class="gsearch">
        <el-col>
            <el-input placeholder="请输入商品名称" clearable class="searchinput" v-model="query" @keyup.enter.native="goodsSearch">
                <el-button slot="append" icon="el-icon-search" @click="goodsSearch"></el-button>
            </el-input>
            <el-button type="success" class="addbtn" @click="showGoodsdialog">添加商品</el-button>
        </el-col>
    </el-row>
    <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%" class="gtable">
        <el-table-column type="index" :index='indexMethod' label="#" width="60">
        </el-table-column>
        <el-table-column prop="gid" label="商品编号" width="100">
        </el-table-column>
        <el-table-column prop="gname" label="商品名称" width="200">
        </el-table-column>
        <el-table-column prop="gspec" label="商品规格" width="160">
        </el-table-column>
        <el-table-column prop="giprice" label="商品进价/元" width="120">
        </el-table-column>
        <el-table-column prop="gprice" label="商品售价/元" width="120">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" circle plain @click="showEditGoodsDialog(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle plain @click="showDelGoodsDialog(scope.row)"></el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination class="gpage" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
    </el-pagination>

    <!-- 添加商品对话框 -->
    <el-dialog title="添加商品" :visible.sync="dialogFormVisibleAdd" :before-close="cancelAdd">
        <el-form :model="form">
            <el-form-item label="商品名称" label-width="140px">
                <el-input v-model="form.gname" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品规格" label-width="140px">
                <el-input v-model="form.gspec" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品进价" label-width="140px">
                <el-input v-model="form.giprice" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品售价/元" label-width="140px">
                <el-input v-model="form.gprice" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="cancelAdd">取 消</el-button>
            <el-button type="primary" @click="addGoods">确 定</el-button>
        </div>
    </el-dialog>

        <!-- 修改商品对话框 -->
    <el-dialog title="修改商品" :visible.sync="dialogFormVisibleEdit" :before-close="cancelEdit">
        <el-form :model="tempform">
            <el-form-item label="商品名称" label-width="140px">
                <el-input v-model="tempform.gname" autocomplete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品规格" label-width="140px">
                <el-input v-model="tempform.gspec" autocomplete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品进价/元" label-width="140px">
                <el-input v-model="tempform.giprice" autocomplete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品售价/元" label-width="140px">
                <el-input v-model="tempform.gprice" autocomplete="off" clearable></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="cancelEdit">取 消</el-button>
            <el-button type="primary" @click="editGoods">确 定</el-button>
        </div>
    </el-dialog>
</el-card>
</template>

<script>
export default {
    data() {
        return {
            query: '',
            tableData: [],
            pageSize: 6,
            currentPage: 1,
            total: 0,
            dialogFormVisibleAdd: false,
            dialogFormVisibleEdit: false,
            form: {
                gname: '',
                gspec: '',
                giprice:'',
                gprice: '',
                gid:''
            },
            tempform: {
                gname: '',
                gspec: '',
                giprice:'',
                gprice: '',
                gid: ''
            }
        }
    },
    created() {
        this.getData()
    },
    methods: {
        // 获取数据,渲染
        async getData() {
            const res = await this.$http.get('showGoods')
            this.tableData = res.data
            this.total = this.tableData.length
            for(let i = 0; i < this.total; i++) {
                this.tableData[i].giprice = parseFloat(this.tableData[i].giprice).toFixed(2)
                this.tableData[i].gprice = parseFloat(this.tableData[i].gprice).toFixed(2)
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
        },
        // 搜索商品
        async goodsSearch() {
            const res = await this.$http.post('searchGoods', {
                query: this.query
            })
            this.tableData = res.data
            this.total = this.tableData.length
            for(let i = 0; i < this.total; i++) {
                this.tableData[i].giprice = parseFloat(this.tableData[i].giprice).toFixed(2)
                this.tableData[i].gprice = parseFloat(this.tableData[i].gprice).toFixed(2)
            }
            this.currentPage = 1
        },
        //添加商品
        // 添加对话框
        showGoodsdialog() {
            this.dialogFormVisibleAdd = true
        },
        // 取消添加
        cancelAdd(){
            this.dialogFormVisibleAdd = false
            this.form = {}
        },
        // 确认提交提交事件
        async addGoods() {
            this.form.gprice = parseFloat(this.form.gprice)
            this.form.giprice = parseFloat(this.form.giprice)
            const res = await this.$http.post('addGoods', this.form)
            const status = res.status
            if (status == 200) {
                this.$message.success("添加成功")
                this.dialogFormVisibleAdd = false
                this.getData()
                this.form = {}
                this.currentPage = 1
            } else {
                this.$message.warning("添加失败")
            }
        },
        // 删除商品
        showDelGoodsDialog(val) {
            let indexgid = val.gid
            this.$confirm('确认删除商品？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const res = await this.$http.post('delGoods', {
                    gid: indexgid
                })
                if (res.status == 200) {
                    this.getData()
                    this.currentPage = 1
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                } else {
                    this.$message({
                        type: 'warning',
                        message: '删除失败!'
                    })
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        // 修改商品
        showEditGoodsDialog(val) {
            this.dialogFormVisibleEdit = true
            this.tempform = {
                gname: val.gname,
                gspec: val.gspec,
                giprice:val.giprice,
                gprice: val.gprice,
                gid: val.gid
            }
        },
        cancelEdit(){
            this.dialogFormVisibleEdit = false
            this.tempform = {}
        },
        async editGoods(){
            this.tempform.gprice = parseFloat(this.tempform.gprice)
            this.tempform.giprice = parseFloat(this.tempform.giprice)
            const res = await this.$http.post('updateGoods', this.tempform)
            const status = res.status
            if (status == 200) {
                this.$message.success("修改成功")
                this.dialogFormVisibleEdit = false
                this.getData()
                this.currentPage = 1
                this.tempform = {}
            } else {
                this.$message.warning("修改失败")
            }
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
