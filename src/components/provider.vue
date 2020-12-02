<template>
<el-card class="box-card">
    <el-row class="stsearch">
        <el-col>
            <el-input placeholder="请输入供应商名称" clearable class="stsearchinput" v-model="query" @keyup.enter.native="searchevent">
                <el-button slot="append" icon="el-icon-search" @click="searchevent"></el-button>
            </el-input>
            <el-button type="success" class="gtaddbtn" @click="showAddDialog">添加供应商</el-button>
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
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" circle plain @click="showEditDialog(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle plain @click.prevent="showDelDialog(scope.row)"></el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination class="gpage" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
    </el-pagination>

    <!-- 添加供应商对话框 -->
    <el-dialog title="添加供应商" :visible.sync="dialogFormVisibleAdd" :before-close="handleClose">
        <el-form :model="form">
            <el-form-item label="供应商名称" label-width="140px">
                <el-input v-model="form.pname" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="供应商地址" label-width="140px">
                <el-input v-model="form.paddr" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="供应商电话" label-width="140px">
                <el-input v-model="form.ptel" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="addProvider">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 修改供应商 -->
    <el-dialog title="修改供应商" :visible.sync="dialogFormVisibleEdit" :before-close="handleEditClose">
        <el-form :model="tempform">
            <el-form-item label="供应商名称" label-width="140px">
                <el-input v-model="tempform.pname" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="供应商地址" label-width="140px">
                <el-input v-model="tempform.paddr" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="供应商电话" label-width="140px">
                <el-input v-model="tempform.ptel" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="handleEditClose">取 消</el-button>
            <el-button type="primary" @click="EditProvider">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 删除供应商对话框 -->
    <el-dialog title="提示" :visible.sync="dialogFormVisibleDel" width="25%" :show-close="false">
        <em>是否确定删除</em>
        <div slot="footer">
            <el-button @click="cancelDel">取 消</el-button>
            <el-button type="primary" @click="DelProvider">确 定</el-button>
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
            total: 0,
            pageSize: 6,
            currentPage: 1,
            selectname: [],
            dialogFormVisibleAdd: false,
            dialogFormVisibleEdit: false,
            dialogFormVisibleDel: false,
            form: {
                pname: '',
                paddr: '',
                ptel: ''
            },
            // 临时
            tempform: {
                pname: '',
                paddr: '',
                ptel: ''
            },
            delpid: ''
        }
    },
    created() {
        this.getData()
    },
    methods: {
        // 删除供应商
        showDelDialog(val) {
            this.dialogFormVisibleDel = true
            this.delpid = val.pid
        },
        async DelProvider() {
            const res = await this.$http.post('delProvider', {
                pid: this.delpid
            })
            if (res.status == 200) {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                })
                this.getData()
                this.currentPage = 1
                this.dialogFormVisibleDel = false
            } else {
                this.$message.warning("删除失败")
                this.dialogFormVisibleDel = false
            }
        },
        cancelDel(){
            this.dialogFormVisibleDel = false
            this.$message({
                    message: '已取消删除'
                })
        },
        // 修改供应商
        showEditDialog(val) {
            this.tempform = {
                pname: val.pname,
                paddr: val.paddr,
                ptel: val.ptel,
                pid: val.pid
            }
            this.dialogFormVisibleEdit = true
        },
        async EditProvider() {
            const res = await this.$http.post('updateProvider', this.tempform)
            const status = res.status
            if (status == 200) {
                this.$message.success("修改成功")
                this.dialogFormVisibleEdit = false
                this.getData()
                this.tempform = {}
                this.currentPage = 1
            } else {
                this.$message.warning("修改失败")
            }
        },
        handleEditClose() {
            this.dialogFormVisibleEdit = false
            this.tempform = {}
        },
        // 添加供应商
        showAddDialog() {
            this.dialogFormVisibleAdd = true
        },
        async addProvider() {
            const res = await this.$http.post('addProvider', this.form)
            const status = res.status
            if (status == 200) {
                this.$message.success("添加成功")
                this.dialogFormVisibleAdd = false
                this.getData()
                this.currentPage = 1
                this.form = {}
            } else {
                this.$message.warning("添加失败")
            }
        },
        handleClose() {
            this.form = {}
            this.dialogFormVisibleAdd = false
        },
        // 搜索
        async searchevent() {
            const res = await this.$http.post('searchPro', {
                query: this.query
            })
            this.tableData = res.data
            this.total = this.tableData.length
            this.currentPage = 1
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
