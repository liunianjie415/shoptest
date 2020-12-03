<template>
<el-card class="box-card">
    <el-button type="success" plain icon="el-icon-check" class="addbtn"></el-button>
    <el-button type="primary" plain icon="el-icon-plus" class="addbtn" @click="showAddDialog"></el-button>
    <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" class="billtable">
        <el-table-column type="index" :index='indexMethod' label="#" width="60">
        </el-table-column>
        <el-table-column prop="uname" label="商品名称" width="160">
        </el-table-column>
        <el-table-column prop="gspec" label="商品规格" width="120">
        </el-table-column>
        <el-table-column prop="secount" label="消费数量" width="90">
        </el-table-column>
        <el-table-column prop="udid" label="折扣编号" width="90">
        </el-table-column>
        <el-table-column prop="dname" label="折扣名称" width="160">
        </el-table-column>
        <el-table-column prop="sebprice" label="消费金额" width="90">
        </el-table-column>
        <el-table-column prop="seeprice" label="折后金额" width="90">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" plain @click="showEditDialog(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" plain></el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination background :current-page="currentPage" :page-size="pageSize" layout="total,prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
    </el-pagination>

    <!-- 添加账单对话框 -->
    <el-dialog title="添加商品" :visible.sync="dialogFormVisibleAdd" width="25%" :before-close="cancelAdd">
        <el-form :model="form">
            <el-form-item label="商品名称" label-width="95px">
                <el-autocomplete clearable :fetch-suggestions="querySearch" v-model="form.uname" @select="handleunameSelect" @clear="clearuname" class="adjinput">
                    <template slot-scope="{ item }">
                        <div>{{ item.value }}</div>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="商品规格" label-width="95px">
                <el-input v-model="form.gspec" autocomplete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="消费数量" label-width="95px">
                <el-input-number v-model="form.secount" :min="1" class="adjinput" @change="changecount"></el-input-number>
            </el-form-item>
            <el-form-item label="折扣编号" label-width="95px">
                <el-autocomplete clearable :fetch-suggestions="querySearchdid" v-model="form.udid" @select="handleudidSelect" @clear="clearudid" class="adjinput">
                    <template slot-scope="{ item }">
                        <div>{{ item.value }}</div>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="折扣名称" label-width="95px">
                <el-input v-model="form.dname" autocomplete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="消费金额" label-width="95px">
                <el-input v-model="form.sebprice" autocomplete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="折后金额" label-width="95px">
                <el-input v-model="form.seeprice" autocomplete="off" disabled></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="cancelAdd">取 消</el-button>
            <el-button type="primary" @click.prevent="confirmAdd">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 编辑账单对话框 -->
    <el-dialog title="修改商品" :visible.sync="dialogFormVisibleEdit" width="25%" :before-close="cancelEdit">
        <el-form :model="tempform">
            <el-form-item label="商品名称" label-width="95px">
                <el-input v-model="tempform.uname" autocomplete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="商品规格" label-width="95px">
                <el-input v-model="tempform.gspec" autocomplete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="消费数量" label-width="95px">
                <el-input-number v-model="tempform.secount" :min="1" class="adjinput" @change="changeEditcount"></el-input-number>
            </el-form-item>
            <el-form-item label="折扣编号" label-width="95px">
                <el-autocomplete clearable :fetch-suggestions="querySearchdid" v-model="tempform.udid" @select="handleEditudidSelect" @clear="clearEditudid" class="adjinput">
                    <template slot-scope="{ item }">
                        <div>{{ item.value }}</div>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="折扣名称" label-width="95px">
                <el-input v-model="tempform.dname" autocomplete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="消费金额" label-width="95px">
                <el-input v-model="tempform.sebprice" autocomplete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="折后金额" label-width="95px">
                <el-input v-model="tempform.seeprice" autocomplete="off" disabled></el-input>
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
            tableData: [],
            currentPage: 1,
            pageSize: 6,
            total: 0,
            selectugname: [],
            selectudid: [],
            dialogFormVisibleAdd: false,
            dialogFormVisibleEdit: false,
            form: {
                sedate: '',
                uname: '',
                secount: '',
                sebprice: '',
                udid: '',
                seeprice: '',
                dnum: '',
                gprice: '',
                gspec: '',
                dname: ''
            },
            tempform: {
                sedate: '',
                uname: '',
                secount: '',
                sebprice: '',
                udid: '',
                seeprice: '',
                dnum: '',
                gprice: '',
                gspec: '',
                dname: ''
            }
        }
    },
    created() {
        this.getUgname()
        this.getUdid()
    },
    methods: {
        // 编辑商品信息
        showEditDialog(val) {
            console.log(val)
            this.tempform = {
                sedate: val.sedate,
                uname: val.uname,
                secount: val.secount,
                sebprice: val.sebprice,
                udid: val.udid,
                seeprice: val.seeprice,
                dnum: val.dnum,
                gprice: val.gprice,
                gspec: val.gspec,
                dname: val.dname
            }
            this.dialogFormVisibleEdit = true
        },
        handleEditudidSelect(val) {
            this.tempform.dnum = val.dnum
            this.tempform.dname = val.dname
            let seeprice = ((parseFloat(this.tempform.sebprice) * parseFloat(this.tempform.dnum)).toFixed(2)).toString()
            this.tempform.seeprice = isNaN(seeprice) ? '' : seeprice
        },
        clearEditudid() {
            this.tempform.seeprice = ''
            this.tempform.dname = ''
            this.tempform.dnum = ''
        },
        changeEditcount(val) {
            this.tempform.secount = val
            this.tempform.sebprice = ((parseFloat(this.tempform.gprice) * parseFloat(this.tempform.secount)).toFixed(2)).toString()
            let seeprice = ((parseFloat(this.tempform.sebprice) * parseFloat(this.tempform.dnum)).toFixed(2)).toString()
            this.tempform.seeprice = isNaN(seeprice) ? '' : seeprice
        },
        cancelEdit() {
            this.dialogFormVisibleEdit = false
            this.tempform = {
                sedate: '',
                uname: '',
                secount: '1',
                sebprice: '',
                udid: '',
                seeprice: '',
                dnum: '',
                gprice: '',
                gspec: '',
                dname: ''
            }
        },
        confirmEdit() {
            this.form = this.tempform
            console.log(this.tempform)
            this.dialogFormVisibleEdit = false
            // this.tempform = {
            //     sedate: '',
            //     uname: '',
            //     secount: '1',
            //     sebprice: '',
            //     udid: '',
            //     seeprice: '',
            //     dnum: '',
            //     gprice: '',
            //     gspec: '',
            //     dname: ''
            // }
        },
        // 添加商品
        showAddDialog() {
            this.dialogFormVisibleAdd = true
        },
        handleunameSelect(val) {
            this.form.gprice = val.gprice
            this.form.sebprice = ((parseFloat(this.form.gprice) * parseFloat(this.form.secount)).toFixed(2)).toString()
            this.form.gspec = val.gspec
        },
        clearuname() {
            this.form.sebprice = ''
            this.form.seeprice = ''
            this.form.gspec = ''
        },
        handleudidSelect(val) {
            this.form.dnum = val.dnum
            let seeprice = ((parseFloat(this.form.sebprice) * parseFloat(this.form.dnum)).toFixed(2)).toString()
            this.form.seeprice = isNaN(seeprice) ? '' : seeprice
            this.form.dname = val.dname
        },
        clearudid() {
            this.form.seeprice = ''
            this.form.dname = ''
            this.form.dnum = ''
        },
        changecount(val) {
            this.form.secount = val
            this.form.sebprice = ((parseFloat(this.form.gprice) * parseFloat(this.form.secount)).toFixed(2)).toString()
            let seeprice = ((parseFloat(this.form.sebprice) * parseFloat(this.form.dnum)).toFixed(2)).toString()
            this.form.seeprice = isNaN(seeprice) ? '' : seeprice
        },
        cancelAdd() {
            this.dialogFormVisibleAdd = false
            this.form = {
                sedate: '',
                uname: '',
                secount: '1',
                sebprice: '',
                udid: '',
                seeprice: '',
                dnum: '',
                gprice: '',
                gspec: '',
                dname: ''
            }
        },
        confirmAdd() {
            this.tableData.push(this.form)
            this.total = this.tableData.length
            this.$message.success("添加成功")
            this.dialogFormVisibleAdd = false
            this.form = {
                sedate: '',
                uname: '',
                secount: '1',
                sebprice: '',
                udid: '',
                seeprice: '',
                dnum: '',
                gprice: '',
                gspec: '',
                dname: ''
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
        // 获取所有折扣编号
        async getUdid() {
            const res = await this.$http.get('showDiscount')
            this.selectudid = res.data
            let key = "value"
            for (let i = 0; i < this.selectudid.length; i++) {
                let value = this.selectudid[i].did.toString()
                this.selectudid[i][key] = value
            }
        },
        querySearchdid(queryString, cb) {
            var selectudid = this.selectudid;
            var results = queryString ? selectudid.filter(this.createFilter(queryString)) : selectudid;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
    }
}
</script>

<style>
.box-card {
    height: 100%;
}

.billtable {
    margin: 15px 0;
}

.adjinput {
    width: 250px;
}

.addbtn {
    float: right;
    margin: 0 15px;
}
</style>
