<template>
<el-card class="box-card">
    <el-row>
        <el-col>
            <el-input placeholder="搜索商品名称" clearable class="dissearchinput" v-model="query" @keyup.enter.native="searchdis">
                <el-button slot="append" icon="el-icon-search" @click="searchdis"></el-button>
            </el-input>
            <el-button type="success" @click="showAddDialog">添加折扣信息</el-button>
        </el-col>
    </el-row>
    <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%" class="dtable">
        <el-table-column type="index" :index='indexMethod' label="#" width="60">
        </el-table-column>
        <el-table-column prop="did" label="折扣编号" width="80">
        </el-table-column>
        <el-table-column prop="dname" label="折扣名称" width="120">
        </el-table-column>
        <el-table-column prop="ugname" label="商品名称" width="120">
        </el-table-column>
        <el-table-column prop="ddesc" label="打折力度" width="140">
        </el-table-column>
        <el-table-column prop="dbdate" label="起始时间" width="170">
        </el-table-column>
        <el-table-column prop="dedate" label="结束时间" width="170">
        </el-table-column>
        <el-table-column label="状态" width="80">
            <template slot-scope="scope">
                <el-switch disabled v-model="scope.row.state"></el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="danger" @click="showEditDialog(scope.row)">修改</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination background :current-page="currentPage" :page-size="pageSize" layout="total,prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
    </el-pagination>

    <!-- 添加折扣对话框 -->
    <el-dialog title="添加折扣信息" :visible.sync="dialogFormVisibleAdd" width="30%" :before-close="cancelAdd">
        <el-form :model="form">
            <el-form-item label="折扣名称" label-width="75px">
                <el-input v-model="form.dname" autocomplete="off" class="inputadj" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品名称" label-width="75px">
                <el-autocomplete clearable :fetch-suggestions="querySearch" v-model="form.ugname">
                    <template slot-scope="{ item }">
                        <div>{{ item.gname }}</div>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="折扣描述" label-width="75px">
                <el-input v-model="form.ddesc" autocomplete="off" class="inputadj" clearable></el-input>
            </el-form-item>
            <el-form-item label="开始时间" label-width="75px">
                <el-date-picker v-model="form.dbdate" type="datetime" placeholder="选择日期" clearable>
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" label-width="75px">
                <el-date-picker v-model="form.dedate" type="datetime" placeholder="选择日期" clearable>
                </el-date-picker>
            </el-form-item>
            <el-form-item label="折扣数据" label-width="75px">
                <el-input v-model="form.dnum" autocomplete="off" class="inputadj" clearable></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="cancelAdd">取 消</el-button>
            <el-button type="primary" @click.prevent="confirmAdd">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="修改折扣信息" :visible.sync="dialogFormVisibleEdit" width="30%" :before-close="cancelEdit">
        <el-form :model="tempform">
            <el-form-item label="折扣名称" label-width="75px">
                <el-input v-model="tempform.dname" autocomplete="off" class="inputadj" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品名称" label-width="75px" >
                <el-input v-model="tempform.ugname" autocomplete="off" class="inputadj" disabled></el-input>
            </el-form-item>
            <el-form-item label="折扣描述" label-width="75px">
                <el-input v-model="tempform.ddesc" autocomplete="off" class="inputadj" clearable></el-input>
            </el-form-item>
            <el-form-item label="开始时间" label-width="75px" >
                <el-date-picker v-model="tempform.dbdate" type="datetime" placeholder="选择日期" disabled>
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" label-width="75px">
                <el-date-picker v-model="tempform.dedate" type="datetime" placeholder="选择日期" clearable>
                </el-date-picker>
            </el-form-item>
            <el-form-item label="折扣数据" label-width="75px">
                <el-input v-model="tempform.dnum" autocomplete="off" class="inputadj" clearable></el-input>
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
            currentPage: 1,
            pageSize: 6,
            total: 0,
            tableData: [],
            selectugname: [],
            dialogFormVisibleAdd: false,
            dialogFormVisibleEdit: false,
            form: {
                dname: '',
                ugname: '',
                ddesc: '',
                dbdate: '',
                dedate: '',
                dnum: ''
            },
            tempform: {
                dname: '',
                ugname: '',
                ddesc: '',
                dbdate: '',
                dedate: '',
                dnum: '',
                did: ''
            }
        }
    },
    created() {
        this.getData()
        this.getUgname()
    },
    methods: {
        // 修改折扣信息
        showEditDialog(val) {
            this.dialogFormVisibleEdit = true
            this.tempform = {
                dname: val.dname,
                ugname: val.ugname,
                ddesc: val.ddesc,
                dbdate: val.dbdate,
                dedate: val.dedate,
                dnum: val.dnum,
                did: val.did
            }
        },
        cancelEdit() {
            this.dialogFormVisibleEdit = false
            this.tempform = {}
        },
        async confirmEdit() {
            const res = await this.$http.post('updateDiscount', {
                dname: this.tempform.dname,
                ddesc:this.tempform.ddesc,
                dedate:moment(this.tempform.dedate).format('YYYY-MM-DD HH:mm:ss'),
                dnum:this.tempform.dnum,
                did: this.tempform.did
            })
            const status = res.status
            if (status == 200) {
                this.$message.success("修改成功")
                this.dialogFormVisibleEdit = false
                this.getData()
                this.tempform = {}
            } else {
                this.$message.warning("修改失败")
            }
        },
        // 添加折扣信息
        showAddDialog() {
            this.dialogFormVisibleAdd = true
        },
        cancelAdd() {
            this.dialogFormVisibleAdd = false
            this.form = {}
        },
        async confirmAdd() {
            this.form.dbdate = moment(this.form.dbdate).format('YYYY-MM-DD HH:mm:ss')
            this.form.dedate = moment(this.form.dedate).format('YYYY-MM-DD HH:mm:ss')
            const res = await this.$http.post('addDiscount', this.form)
            const status = res.status
            if (status == 200) {
                this.$message.success("添加成功")
                this.dialogFormVisibleAdd = false
                this.form = {}
                this.getData()
                this.currentPage = 1
            } else {
                this.$message.warning("添加失败")
            }
        },
        // 搜索
        async searchdis() {
            const res = await this.$http.post('showDiscountbyquery', {
                query: this.query
            })
            let data = res.data
            for (let i = 0; i < data.length; i++) {
                data[i].dbdate = moment(data[i].dbdate).format('YYYY-MM-DD HH:mm:ss')
                data[i].dedate = moment(data[i].dedate).format('YYYY-MM-DD HH:mm:ss')
            }
            this.tableData = data
            for (let i = 0; i < this.tableData.length; i++) {
                this.tableData[i].state = moment().isBefore(this.tableData[i].dedate)
            }
            this.total = this.tableData.length
            this.currentPage = 1
        },
        // 获取数据
        async getData() {
            const res = await this.$http.get('showDiscount')
            let data = res.data
            for (let i = 0; i < data.length; i++) {
                data[i].dbdate = moment(data[i].dbdate).format('YYYY-MM-DD HH:mm:ss')
                data[i].dedate = moment(data[i].dedate).format('YYYY-MM-DD HH:mm:ss')
            }
            this.tableData = data
            this.total = this.tableData.length
            for (let i = 0; i < this.tableData.length; i++) {
                this.tableData[i].state = moment().isBefore(this.tableData[i].dedate)
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
        // 获得所有商品名称
        async getUgname() {
            const res = await this.$http.get('showGoods')
            this.selectugname = res.data
            let key = "value"
            for (let i = 0; i < this.selectugname.length; i++) {
                let value = this.selectugname[i].gname
                this.selectugname[i][key] = value
            }
        },
        querySearch(queryString, cb) {
            var selectugname = this.selectugname;
            var results = queryString ? selectugname.filter(this.createFilter(queryString)) : selectugname;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (item) => {
                return item.value.toUpperCase().match(queryString.toUpperCase());
            };
        },
    },
}
</script>

<style>
.box-card {
    height: 100%;
}

.dissearchinput {
    width: 300px;
}

.dtable {
    margin: 15px 0;
}

.inputadj {
    width: 220px;
}
</style>
