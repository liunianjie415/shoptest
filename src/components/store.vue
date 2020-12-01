<template>
<el-card class="box-card">
  <el-row class="stsearch">
    <el-col>
      <el-input placeholder="请输入商品名称" clearable class="stsearchinput" v-model="query" @keyup.enter.native="searchevent">
        <el-button slot="append" icon="el-icon-search" @click="searchevent"></el-button>
      </el-input>
      <el-button type="success" class="gtaddbtn" @click="showAddDialog">添加库存信息</el-button>
    </el-col>
  </el-row>
  <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%">
    <el-table-column type="index" :index='indexMethod' label="#" width="60">
    </el-table-column>
    <el-table-column prop="sid" label="库存编号" width="100">
    </el-table-column>
    <el-table-column prop="ugname" label="商品名称" width="180">
    </el-table-column>
    <el-table-column prop="scount" label="库存数量" width="120">
    </el-table-column>
    <el-table-column prop="pname" label="供应商名称" width="180">
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" circle plain @click="showEditDialog(scope.row)"></el-button>
        <el-button type="danger" icon="el-icon-delete" circle plain @click="delStore(scope.row)"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination class="gpage" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
  </el-pagination>
  <!-- 添加数据对话框 -->
  <el-dialog title="添加数据" :visible.sync="dialogFormVisibleAdd" width="35%" :before-close="canceladd">
    <el-form :model="form">
      <el-form-item label="商品名称">
        <el-autocomplete clearable :fetch-suggestions="querySearchgname" v-model="form.ugname">
          <template slot-scope="{ item }">
            <div>{{ item.value }}</div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="库存数量">
        <el-input-number v-model="form.scount" :min="0" class="addinput"></el-input-number>
      </el-form-item>
      <el-form-item label="供应商名称">
        <el-autocomplete clearable :fetch-suggestions="querySearchpname" v-model="form.pname" @select="handleSelect">
          <template slot-scope="{ item }">
            <div>{{ item.pname }}</div>
          </template>
        </el-autocomplete>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="canceladd">取 消</el-button>
      <el-button type="primary" @click="confirmadd">确 定</el-button>
    </div>
  </el-dialog>

  <!-- 修改数据对话框 -->
  <el-dialog title="修改库存信息" :visible.sync="dialogFormVisibleEdit" width="35%" :before-close="canceledit">
    <el-form :model="tempform">
      <el-form-item label="商品名称">
        <el-autocomplete clearable :fetch-suggestions="querySearchgname" v-model="tempform.ugname">
          <template slot-scope="{ item }">
            <div>{{ item.value }}</div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="库存数量">
        <el-input-number v-model="tempform.scount" :min="0" class="addinput"></el-input-number>
      </el-form-item>
      <el-form-item label="供应商名称">
        <el-autocomplete clearable :fetch-suggestions="querySearchpname" v-model="tempform.pname" @select="handleSelectEdit">
          <template slot-scope="{ item }">
            <div>{{ item.pname }}</div>
          </template>
        </el-autocomplete>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="canceledit">取 消</el-button>
      <el-button type="primary" @click="confirmEdit">确 定</el-button>
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
      form: {
        ugname: '',
        scount: '',
        upid: '',
        pname: ''
      },
      // 未录入库存的商品
      selectgname: [],
      //  所有供应商的名称
      selectpname: [],
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      tempform: {
        ugname: '',
        scount: '',
        upid: '',
        pname: '',
      },
      editsid:''
    }
  },
  created() {
    this.getData()
    this.getgname()
    this.getpname()
  },
  methods: {
    //   修改功能
    showEditDialog(val) {
      this.dialogFormVisibleEdit = true
      this.tempform = {
        ugname: val.ugname,
        scount: val.scount,
        upid: val.pid,
        pname: val.pname
      }
      this.editsid = val.sid
    },
    handleSelectEdit(item) {
      this.tempform.upid = item.pid
    },
    canceledit() {
      this.dialogFormVisibleEdit = false
      this.tempform = {
        ugname: '',
        scount: '0',
        upid: '',
        pname: ''
      }
      this.editsid = ''
    },
    async confirmEdit() {
        const res = await this.$http.post('updateStore', {
        ugname: this.tempform.ugname,
        scount: this.tempform.scount,
        upid: this.tempform.upid,
        sid: this.editsid
      })
      const status = res.status
      if (status == 200) {
        this.$message.success("修改成功")
        this.dialogFormVisibleEdit = false
        this.getData()
        this.getgname()
        this.tempform = {
          ugname: '',
          scount: '0',
          upid: '',
          pname: ''
        }
        this.editsid = ''
      } else {
        this.$message.warning("修改失败")
        this.dialogFormVisibleEdit = false
      }
    },
    // 删除功能
    delStore(val) {
      let delsid = val.sid
      this.$confirm('确认删除数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.post('delStore', {
          sid: delsid
        })
        if (res.status == 200) {
          this.getData()
          this.getgname()
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
    // 添加功能
    showAddDialog() {
      this.dialogFormVisibleAdd = true
    },
    // 确认添加
    async confirmadd() {
      const res = await this.$http.post('addStore', {
        ugname: this.form.ugname,
        scount: this.form.scount,
        upid: this.form.upid
      })
      const status = res.status
      if (status == 200) {
        this.$message.success("添加成功")
        this.dialogFormVisibleAdd = false
        this.getData()
        this.getgname()
        this.currentPage = 1
        this.form = {
          ugname: '',
          scount: '0',
          upid: '',
          pname: ''
        }
      } else {
        this.$message.warning("添加失败")
        this.dialogFormVisibleAdd = false
      }
    },
    // 取消添加
    canceladd() {
      this.dialogFormVisibleAdd = false
      this.form = {
        ugname: '',
        scount: '0',
        upid: '',
        pname: ''
      }
    },
    handleSelect(item) {
      this.form.upid = item.pid
    },
    // 带建议的输入框 -- 两个
    querySearchgname(queryString, cb) {
      var selectgname = this.selectgname;
      var results = queryString ? selectgname.filter(this.createFilter(queryString)) : selectgname;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    querySearchpname(queryString, cb) {
      var selectpname = this.selectpname;
      var results = queryString ? selectpname.filter(this.createFilter(queryString)) : selectpname;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (item) => {
        return item.value.toUpperCase().match(queryString.toUpperCase());
      };
    },
    // 获取未录入库存的商品名称
    async getgname() {
      const res = await this.$http.get('goodsNotin')
      this.selectgname = res.data
      for (let i = 0; i < this.selectgname.length; i++) {
        let key = "value"
        let value = this.selectgname[i].gname
        this.selectgname[i][key] = value
      }
    },
    // 获取所有供应商的名称
    async getpname() {
      const res = await this.$http.get('showProvider')
      let data = res.data
      this.selectpname = res.data
      for (let i = 0; i < this.selectpname.length; i++) {
        let key = "value"
        let value = this.selectpname[i].pname
        this.selectpname[i][key] = value
      }
    },
    // 搜索功能
    async searchevent() {
      const res = await this.$http.post('searchInfo', {
        query: this.query
      })
      this.tableData = res.data
      this.total = this.tableData.length
      this.currentPage = 1
    },
    // 获取数据,渲染
    async getData() {
      const res = await this.$http.get('showStore')
      this.tableData = res.data
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
  },
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

.addinput {
  width: 221.4px;
}
</style>
