<template>
<el-card class="box-card">
    <el-row class="gtsearch">
        <el-col>
            <el-autocomplete clearable class="gtsearchinput" v-model="query" :fetch-suggestions="querySearch" placeholder="请输入类别名称">
                <template slot-scope="{ item }">
                    <div>{{ item.value }}</div>
                </template>
                <el-button slot="append" icon="el-icon-search" @click="searchevent"></el-button>
            </el-autocomplete>
            <el-button type="success" class="gtaddbtn" @click="showGoodstypedialog">添加数据</el-button>
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
        <el-table-column prop="gid" label="商品编号" width="100">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" circle plain @click="showEditDialog(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle plain @click="DelGoodstype(scope.row)"></el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination class="gtypebottom" layout="prev, pager, next" :total="total" :page-size="PageSize" :current-page="currentPage" @size-change="handleSizeChange" @current-change="handleCurrentChange">
    </el-pagination>

    <!-- 添加数据对话框 -->
    <el-dialog title="添加数据" :visible.sync="dialogFormVisibleAdd" width="30%" :before-close="handleClose">
        <el-form :model="form">
            <el-form-item label="类别名称">
                <el-autocomplete clearable :fetch-suggestions="querySearch" v-model="form.gtname">
                    <template slot-scope="{ item }">
                        <div>{{ item.value }}</div>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="商品名称">
                <el-autocomplete clearable :fetch-suggestions="querySearchty" v-model="addgname" @select="handleSelect" @clear="cleargname">
                    <template slot-scope="{ item }">
                        <div>{{ item.gname }}</div>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="商品编号">
                <el-input v-model="form.uid" autocomplete="off" disabled class="addinput"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="addGoodstype">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 修改数据对话框 -->
    <el-dialog title="修改数据" :visible.sync="dialogFormVisibleEdit" width="30%" :before-close="cancelEdit">
        <el-form :model="temp">
            <el-form-item label="类别名称">
                <el-autocomplete clearable :fetch-suggestions="querySearch" v-model="temp.gtname">
                    <template slot-scope="{ item }">
                        <div>{{ item.value }}</div>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="商品名称">
                <el-autocomplete clearable :fetch-suggestions="querySearchty" v-model="temp.gname" @select="handleEditSelect" @clear="clearEditgname">
                    <template slot-scope="{ item }">
                        <div>{{ item.gname }}</div>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="商品编号">
                <el-input v-model="temp.uid" autocomplete="off" disabled class="addinput"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="cancelEdit">取 消</el-button>
            <el-button type="primary" @click="confirmedit">确 定</el-button>
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
            PageSize: 6,
            currentPage: 1,
            selecttype: [],
            dialogFormVisibleAdd: false,
            dialogFormVisibleEdit: false,
            // 保存要添加的数据
            // gtname: '',
            // gname: '',
            // uid: ''
            addgname: '',
            form: {
                gtname: '',
                uid: ''
            },
            // 未分类好的数据
            notypedata: [],
            // 用来存编辑后的临时数据
            temp: {
                gtid: '',
                gtname: '',
                uid: '',
                gname: ''
            },
        }
    },
    created() {
        this.getData()
        this.getnotype()
    },
    mounted() {
        this.selecttype = this.loadAll()
    },
    methods: {
        // 修改数据
        showEditDialog(val) {
            this.dialogFormVisibleEdit = true
            this.temp = {
                gtid: val.gtid,
                gtname: val.gtname,
                uid: val.gid,
                gname: val.gname
            }
        },
        // 确认
        async confirmedit() {
            const res = await this.$http.post('updateGoodstype', {
                gtname: this.temp.gtname,
                uid: this.temp.uid,
                gtid: this.temp.gtid
            })
            const status = res.status
            if (status == 200) {
                this.$message.success("修改成功")
                this.dialogFormVisibleEdit = false
                this.getData()
                this.getnotype()
                this.temp = {}
                this.currentPage = 1
            } else {
                this.$message.warning("修改失败")
            }
        },
        handleEditSelect(item) {
            this.temp.uid = item.gid
        },
        clearEditgname(item) {
            this.temp.uid = ''
        },
        cancelEdit() {
            this.dialogFormVisibleEdit = false
            this.temp = {}
        },
        // 获取未分类的商品数据
        async getnotype() {
            const res = await this.$http.get('shownotypegoods')
            this.notypedata = res.data
            for (let i = 0; i < this.notypedata.length; i++) {
                let key = "value"
                let value = this.notypedata[i].gname
                this.notypedata[i][key] = value
            }
        },
        // 添加数据
        // 关闭X的事件
        handleClose() {
            this.form = {}
            this.addgname = ""
            this.dialogFormVisibleAdd = false
        },
        // 显示对话添加对话框
        showGoodstypedialog() {
            this.dialogFormVisibleAdd = true
            for (let i = 0; i < this.notypedata.length; i++) {
                if (this.notypedata[i].gtname = this.form.gtname) {
                    this.form.uid = this.notypedata[i].uid
                }
            }
        },
        querySearchty(queryString, cb) {
            var notypedata = this.notypedata;
            var results = queryString ? notypedata.filter(this.createFilter(queryString)) : notypedata;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        handleSelect(item) {
            this.form.uid = item.gid
        },
        cleargname() {
            this.form.uid = ''
        },
        async addGoodstype() {
            const res = await this.$http.post('addGoodstype', this.form)
            const status = res.status
            if (status == 200) {
                this.$message.success("添加成功")
                this.dialogFormVisibleAdd = false
                this.getData()
                this.getnotype()
                this.form = {}
                this.addgname = ''
                this.currentPage = 1
            } else {
                this.$message.warning("添加失败")
            }
        },
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

        // 搜索
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
        loadAll() {
            return [{
                "value": "食品类"
            }, {
                "value": "日用品类"
            }, {
                "value": "文具类"
            }, {
                "value": "水果类"
            }, {
                "value": "饮料类"
            }, {
                "value": "其他类"
            }]
        },
        async searchevent() {
            const res = await this.$http.post('searchGt', {
                query: this.query
            })
            this.tableData = res.data
            this.total = this.tableData.length
            this.currentPage = 1
        },
        // 删除数据
        DelGoodstype(val) {
            let indexgtid = val.gtid
            this.$confirm('确认删除数据？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const res = await this.$http.post('delGoodstype', {
                    gtid: indexgtid
                })
                if (res.status == 200) {
                    this.getData()
                    this.getnotype()
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
        }
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

.addinput {
    width: 221.4px;
}
</style>
