<template>
<el-card class="box-card">
    <el-row>
        <el-col>
            <el-input placeholder="搜索员工名称" clearable class="empsearchinput" v-model="query" @keyup.enter.native="searchemp">
                <el-button slot="append" icon="el-icon-search" @click="searchemp"></el-button>
            </el-input>
            <el-button type="success" @click="showAddDialog">添加员工</el-button>
        </el-col>
    </el-row>
    <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%" class="emptable">
        <el-table-column type="index" :index='indexMethod' label="#" width="60">
        </el-table-column>
        <el-table-column prop="eid" label="员工编号" width="100">
        </el-table-column>
        <el-table-column prop="ename" label="员工名称" width="200">
        </el-table-column>
        <el-table-column prop="eintime" label="入职时间" width="140">
        </el-table-column>
        <el-table-column prop="eouttime" label="离职时间" width="140">
        </el-table-column>
        <el-table-column prop="eauth" label="员工权限" width="130">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" circle plain @click.prevent="handleEdit(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle plain @click.prevent="handleDel(scope.row)"></el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination background :current-page="currentPage" :page-size="pageSize" layout="total,prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
    </el-pagination>

    <!-- 添加员工对话框 -->
    <el-dialog title="添加员工" :visible.sync="dialogFormVisibleAdd" width="26%" :before-close="cancelAdd">
        <el-form :model="form">
            <el-form-item label="员工名称" label-width="95px">
                <el-input v-model="form.ename" autocomplete="off" class="equalauthorise"></el-input>
            </el-form-item>
            <el-form-item label="入职时间" label-width="95px">
                <el-date-picker v-model="form.eintime" type="date" placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="离职时间" label-width="95px">
                <el-date-picker v-model="form.eouttime" type="date" placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="员工权限" label-width="95px">
                <el-autocomplete clearable :fetch-suggestions="querySearch" v-model="form.eauth">
                    <template slot-scope="{ item }">
                        <div>{{ item.value }}</div>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="登录密码" label-width="95px">
                <el-input v-model="form.epassword" autocomplete="off" class="equalauthorise" clearable></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="cancelAdd">取 消</el-button>
            <el-button type="primary" @click.prevent="confirmAdd">确 定</el-button>
        </div>
    </el-dialog>

     <!-- 修改对话框 -->
    <el-dialog title="修改信息" :visible.sync="dialogFormVisibleEdit" width="26%" :before-close="cancelEdit">
        <el-form :model="tempform">
            <el-form-item label="员工名称" label-width="95px">
                <el-input v-model="tempform.ename" autocomplete="off" class="equalauthorise" disabled></el-input>
            </el-form-item>
            <el-form-item label="入职时间" label-width="95px">
                <el-date-picker v-model="tempform.eintime" type="date" placeholder="选择日期" disabled>
                </el-date-picker>
            </el-form-item>
            <el-form-item label="离职时间" label-width="95px">
                <el-date-picker v-model="tempform.eouttime" type="date" placeholder="选择日期" >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="员工权限" label-width="95px">
                <el-autocomplete clearable :fetch-suggestions="querySearch" v-model="tempform.eauth" >
                    <template slot-scope="{ item }">
                        <div>{{ item.value }}</div>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="登录密码" label-width="95px">
                <el-input v-model="tempform.epassword" autocomplete="off" class="equalauthorise" clearable></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="cancelEdit">取 消</el-button>
            <el-button type="primary" @click.prevent="confirmEdit">确 定</el-button>
        </div>
    </el-dialog>
</el-card>
</template>

<script>
import moment from 'moment'
export default {
    data() {
        return {
            query: '',
            tableData: [],
            currentPage: 1,
            pageSize: 6,
            total: 0,
            form: {
                ename: '',
                eintime: '',
                eouttime: '',
                eauth: '',
                epassword: ''
            },
            dialogFormVisibleAdd: false,
            dialogFormVisibleEdit: false,
            selecttype: [{
                "value": "超级管理员"
            }, {
                "value": "进货管理员"
            }, {
                "value": "普通员工"
            }, {
                "value": "折扣管理员"
            }],
            tempform: {
                eid:'',
                ename: '',
                eintime: '',
                eouttime: '',
                eauth: '',
                epassword: ''
            },
        }
    },
    created() {
        this.getData()
    },
    methods: {
        // 修改信息
        handleEdit(val){
            this.dialogFormVisibleEdit = true
            this.tempform = {
                eid:val.eid,
                ename: val.ename,
                eintime: val.eintime,
                eouttime: val.eouttime,
                eauth: val.eauth,
                epassword: val.epassword
            }
        },
        cancelEdit(){
            this.dialogFormVisibleEdit = false
            this.tempform = {}
        },
        async confirmEdit(){
            const res = await this.$http.post('updateEmp', {
                eouttime: moment(this.tempform.eouttime).format('YYYY-MM-DD'),
                eauth: this.tempform.eauth,
                epassword: this.tempform.epassword,
                eid: this.tempform.eid
            })
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
        // 删除员工
        async handleDel(val) {
            let delid = val.eid         
            this.$confirm('确认删除数据？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const res = await this.$http.post('delEmp', {eid : delid})
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
        // 添加员工
        showAddDialog() {
            this.dialogFormVisibleAdd = true
        },
        cancelAdd() {
            this.dialogFormVisibleAdd = false
            this.form = {}
        },
        async confirmAdd() {
            this.form.eintime = moment(this.form.eintime).format('YYYY-MM-DD')
            this.form.eouttime = moment(this.form.eouttime).format('YYYY-MM-DD')
            const res = await this.$http.post('addEmp', this.form)
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
        // 搜索
        async searchemp() {
            const res = await this.$http.post('showEmpsearch', {
                query: this.query
            })
            let data = res.data
            for (let i = 0; i < data.length; i++) {
                data[i].eintime = moment(data[i].eintime).format('YYYY-MM-DD')
                data[i].eouttime = moment(data[i].eouttime).format('YYYY-MM-DD')
            }
            this.tableData = data
            this.total = this.tableData.length
            this.currentPage = 1
        },
        querySearch(queryString, cb) {
            var selecttype = this.selecttype;
            var results = queryString ? selecttype.filter(this.createFilter(queryString)) : selecttype;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (item) => {
                return item.value.toUpperCase().match(queryString.toUpperCase());
            };
        },
        // 获取数据
        async getData() {
            const res = await this.$http.get('showEmp')
            let data = res.data
            for (let i = 0; i < data.length; i++) {
                data[i].eintime = moment(data[i].eintime).format('YYYY-MM-DD')
                data[i].eouttime = moment(data[i].eouttime).format('YYYY-MM-DD')
            }
            this.tableData = data
            this.total = this.tableData.length
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

.emptable {
    margin: 15px 0;
}

.empsearchinput {
    width: 300px;
}

.equalauthorise {
    width: 221.4px;
}
</style>
