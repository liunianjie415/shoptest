<template>
<el-card class="box-card">
    <el-button type="success" plain icon="el-icon-check" class="addbtn" @click="commitbills"></el-button>
    <el-button type="primary" plain icon="el-icon-plus" class="addbtn" @click="showAddDialog"></el-button>
    <el-table :data="
        tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      " class="billtable">
        <el-table-column type="index" :index="indexMethod" label="#" width="60">
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
        <el-table-column prop="sebprice" label="消费金额/元" width="100">
        </el-table-column>
        <el-table-column prop="seeprice" label="折后金额/元" width="100">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" plain @click="showEditDialog(scope.row, scope.$index)"></el-button>
                <el-button type="danger" icon="el-icon-delete" plain @click="handleDel(scope.$index)"></el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination background :current-page="currentPage" :page-size="pageSize" layout="total,prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="width:700px;display:inline-block">
    </el-pagination>
    <div style="display:inline-block;">
        <span>未折扣金额为：<em style="color:red;font-size:25px;font-weight:bolder;display:inline-block;margin-right:5px">{{ this.nbilltotal }}￥</em></span>
        <span>折后金额为：<em style="color:red;font-size:25px;font-weight:bolder">{{ this.billtotal }}￥</em></span>
    </div>
    <!-- 添加商品对话框 -->
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

    <!-- 删除商品对话框 -->
    <el-dialog title="删除商品" :visible.sync="dialogFormVisibleDel" width="16.2%" :show-close="false" custom-class="deldialog">
        <el-button @click="cancelDel" class="cancelbtn">取消</el-button>
        <el-button type="primary" @click="confirmDel">确认</el-button>
    </el-dialog>
</el-card>
</template>

<script>
import moment from "moment";
export default {
    data() {
        return {
            tableData: [],
            currentPage: 1,
            pageSize: 6,
            total: 0,
            selectugname: [],
            selectudid: [],
            unametodid: [],
            dialogFormVisibleAdd: false,
            dialogFormVisibleEdit: false,
            dialogFormVisibleDel: false,
            form: {
                sedate: "",
                uname: "",
                secount: "",
                sebprice: "",
                udid: "",
                seeprice: "",
                dnum: "",
                gprice: "",
                gspec: "",
                dname: "",
            },
            tempform: {
                sedate: "",
                uname: "",
                secount: "",
                sebprice: "",
                udid: "",
                seeprice: "",
                dnum: "",
                gprice: "",
                gspec: "",
                dname: "",
            },
            handleindex: "",
            // 库存信息
            storeArr: [],
            // 折前总消费
            nbilltotal: 0,
            // 折后总消费
            billtotal: 0,
        };
    },
    created() {
        this.getUgname();
        this.getUdid();
        this.getStore();
    },
    methods: {
        // 提交账单
        async commitbills() {
            // sedate,uname,secount,sebprice,udid,seeprice
            let commitdata = [];
            let str = this.randomString(2, 6)
            for (let i = 0; i < this.tableData.length; i++) {
                commitdata.push({
                    sedate: moment().format("YYYY-MM-DD HH:mm:ss"),
                    uname: this.tableData[i].uname,
                    secount: this.tableData[i].secount,
                    sebprice: this.tableData[i].sebprice,
                    udid: parseInt(this.tableData[i].udid),
                    seeprice: this.tableData[i].seeprice,
                    senum: str
                });
            }
            const res = await this.$http.post('addSell', commitdata)
            const status = res.status
            // 提交到sell表后，处理store的数量
            // scount,ugname
            let handlestore = [];
            let storelength = this.storeArr.length;
            for (let i = 0; i < storelength; i++) {
                for (let j = 0; j < commitdata.length; j++) {
                    if (commitdata[j].uname == this.storeArr[i].ugname) {
                        handlestore.push({
                            scount: this.storeArr[i].scount - commitdata[j].secount,
                            ugname: this.storeArr[i].ugname,
                        })
                    }
                }
            }

            // 添加信息到库存信息表中
            let obj = {}
            let finallArr = []
            let len = handlestore.length
            for(let i = 0; i < len; i++) {
                obj = this.changecount(this.storeArr, handlestore[i])
                finallArr.push(obj)
                obj = {}
            }
            this.insertMessage(finallArr)


            const res1 = await this.$http.post('handlecount', handlestore)
            const status1 = res1.status
            if (status == 200 && status1 == 200) {
                this.$message.success("账单提交成功,账单编号为："+ str +"，本次消费为：" + this.billtotal + "￥")
                this.tableData = []
                this.total = 0
                this.billtotal = 0
                this.nbilltotal = 0
            } else {
                this.$message.warning("账单提交失败")
            }
        },
        // 获取库存信息 
        async getStore() {
            const res = await this.$http.get("getcount")
            if (res.status == 200) {
                this.storeArr = res.data
            }
        },
        // 判断库存数量的函数
        judgecount(arr, obj) {
            let length = arr.length;
            for (let i = 0; i < length; i++) {
                if (arr[i].ugname == obj.uname) {
                    if (arr[i].scount < obj.secount) {
                        this.$message.warning(
                            "库存不足，当前商品库存剩余：" + arr[i].scount
                        );
                    }
                }
            }
        },
        // 删除商品
        handleDel(index) {
            this.handleindex = index + (this.currentPage - 1) * this.pageSize;
            this.dialogFormVisibleDel = true;
        },
        cancelDel() {
            this.dialogFormVisibleDel = false;
        },
        confirmDel() {
            this.dialogFormVisibleDel = false;
            this.tableData.splice(this.handleindex, 1);
            this.total = this.tableData.length;
            this.$message.success("删除成功");
        },
        // 编辑商品信息
        showEditDialog(val, index) {
            this.handleindex = index + (this.currentPage - 1) * this.pageSize;
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
                dname: val.dname,
            };
            this.dialogFormVisibleEdit = true;
        },
        handleEditudidSelect(val) {
            this.tempform.dnum = val.dnum;
            this.tempform.dname = val.dname;
            let seeprice = (
                    parseFloat(this.tempform.sebprice) * parseFloat(this.tempform.dnum)
                )
                .toFixed(2)
                .toString();
            this.tempform.seeprice = isNaN(seeprice) ? "" : seeprice;
        },
        clearEditudid() {
            this.tempform.seeprice = this.tempform.sebprice;
            this.tempform.dname = "";
            this.tempform.dnum = "";
        },
        changeEditcount(val) {
            this.tempform.secount = val;
            this.tempform.sebprice = (
                    parseFloat(this.tempform.gprice) * parseFloat(this.tempform.secount)
                )
                .toFixed(2)
                .toString();
            let seeprice = (
                    parseFloat(this.tempform.sebprice) * parseFloat(this.tempform.dnum)
                )
                .toFixed(2)
                .toString()
            this.tempform.seeprice = isNaN(seeprice) ? "" : seeprice
            if (this.tempform.dnum == "") {
                this.tempform.seeprice = this.tempform.sebprice
            }
            this.judgecount(this.storeArr, this.tempform)
        },
        cancelEdit() {
            this.dialogFormVisibleEdit = false
            this.tempform = {
                sedate: "",
                uname: "",
                secount: "1",
                sebprice: "",
                udid: "",
                seeprice: "",
                dnum: "",
                gprice: "",
                gspec: "",
                dname: ""
            }
        },
        confirmEdit() {
            this.dialogFormVisibleEdit = false
            this.tableData.splice(this.handleindex, 1, this.tempform)
            this.tempform = {
                sedate: "",
                uname: "",
                secount: "1",
                sebprice: "",
                udid: "",
                seeprice: "",
                dnum: "",
                gprice: "",
                gspec: "",
                dname: ""
            };
            this.$message.success("修改成功")
            this.billtotal = this.getbilltotal()
            this.nbilltotal = this.getnbilltotal()
        },
        // 添加商品
        showAddDialog() {
            this.dialogFormVisibleAdd = true;
        },
        handleunameSelect(val) {
            this.form.gprice = val.gprice;
            this.form.sebprice = (
                    parseFloat(this.form.gprice) * parseFloat(this.form.secount)
                )
                .toFixed(2)
                .toString();
            this.form.gspec = val.gspec;
            let length = this.unametodid.length;
            this.selectudid = [];
            for (let i = 0; i < length; i++) {
                if (this.unametodid[i].ugname == val.value && (this.unametodid[i].dstate === "false" ? false : true)) {
                    this.selectudid.push(this.unametodid[i]);
                }
            }
            if (this.form.dnum == "") {
                this.form.seeprice = this.form.sebprice;
            }
        },
        clearuname() {
            this.form.sebprice = "";
            this.form.seeprice = "";
            this.form.gspec = "";
            this.selectudid = this.unametodid;
        },
        handleudidSelect(val) {
            this.form.dnum = val.dnum;
            let seeprice = (
                    parseFloat(this.form.sebprice) * parseFloat(this.form.dnum)
                )
                .toFixed(2)
                .toString();
            this.form.seeprice = isNaN(seeprice) ? "" : seeprice;
            this.form.dname = val.dname;
        },
        clearudid() {
            this.form.seeprice = this.form.sebprice;
            this.form.dname = "";
            this.form.dnum = "";
        },
        changecount(val) {
            this.form.secount = val;
            this.form.sebprice = (
                    parseFloat(this.form.gprice) * parseFloat(this.form.secount)
                )
                .toFixed(2)
                .toString();
            let seeprice = (
                    parseFloat(this.form.sebprice) * parseFloat(this.form.dnum)
                )
                .toFixed(2)
                .toString();
            this.form.seeprice = isNaN(seeprice) ? "" : seeprice;
            if (this.form.dnum == "") {
                this.form.seeprice = this.form.sebprice;
            }
            this.judgecount(this.storeArr, this.form);
        },
        cancelAdd() {
            this.dialogFormVisibleAdd = false;
            this.form = {
                sedate: "",
                uname: "",
                secount: "1",
                sebprice: "",
                udid: "",
                seeprice: "",
                dnum: "",
                gprice: "",
                gspec: "",
                dname: "",
            };
        },
        confirmAdd() {
            this.tableData.push(this.form)
            this.total = this.tableData.length
            this.$message.success("添加成功")
            this.dialogFormVisibleAdd = false
            this.form = {
                sedate: "",
                uname: "",
                secount: "1",
                sebprice: "",
                udid: "",
                seeprice: "",
                dnum: "",
                gprice: "",
                gspec: "",
                dname: "",
            }
            this.billtotal = this.getbilltotal()
            this.nbilltotal = this.getnbilltotal()
        },
        //获取序号
        indexMethod(index) {
            return (this.currentPage - 1) * this.pageSize + index + 1;
        },
        // 每页显示的条数
        handleSizeChange(val) {
            // 改变每页显示的条数
            this.pageSize = val;
            // 注意：在改变每页显示的条数时，要将页码显示到第一页
            this.currentPage = 1;
        },
        // 显示第几页
        handleCurrentChange(val) {
            // 改变默认的页数
            this.currentPage = val;
        },
        // 获得所有商品名称
        async getUgname() {
            const res = await this.$http.get("showGoods");
            this.selectugname = res.data;
            let key = "value";
            for (let i = 0; i < this.selectugname.length; i++) {
                let value = this.selectugname[i].gname;
                this.selectugname[i][key] = value;
            }
        },
        querySearch(queryString, cb) {
            var selectugname = this.selectugname;
            var results = queryString ?
                selectugname.filter(this.createFilter(queryString)) :
                selectugname;
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
            const res = await this.$http.get("showDiscount");
            this.selectudid = res.data;
            let key = "value";
            for (let i = 0; i < this.selectudid.length; i++) {
                let value = this.selectudid[i].did.toString();
                this.selectudid[i][key] = value;
            }
            this.unametodid = this.selectudid;
        },
        querySearchdid(queryString, cb) {
            var selectudid = this.selectudid;
            var results = queryString ?
                selectudid.filter(this.createFilter(queryString)) :
                selectudid;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        // 得到随机字符串，由指定个数的大写字母+指定个数的数字组成
        randomString(e, d) {
            let str = "QWERTYUIOPASDFGHJKLZXCVBNM",
                len = str.length,
                num = "1234567890",
                n = ""
            for (let i = 0; i < e; i++) {
                n += str.charAt(Math.floor(Math.random() * len));
            }
            for (let j = 0; j < d; j++) {
                n += num.charAt(Math.floor(Math.random() * 10))
            }
            return n
        },
        // 计算折前总消费
        getnbilltotal() {
            let total = 0
            let len = this.tableData.length
            for (let i = 0; i < len; i++) {
                total += parseFloat(this.tableData[i].sebprice)
            }
            return total.toFixed(2)
        },
        // 计算折后总消费
        getbilltotal() {
            let total = 0
            let len = this.tableData.length
            for (let i = 0; i < len; i++) {
                total += parseFloat(this.tableData[i].seeprice)
            }
            return total.toFixed(2)
        },
        // 处理是增加库存还是减少库存时具体数目的函数
        changecount(storeArr, changeObj) {
            let len = storeArr.length
            var reduce = 0,
                add = 0,
                gname = '',
                str = ''
            for (let i = 0; i < len; i++) {
                if (storeArr[i].ugname == changeObj.ugname) {
                    gname = storeArr[i].ugname
                    if (storeArr[i].scount > changeObj.scount) {
                        reduce = storeArr[i].scount - changeObj.scount
                        add = 0
                        str = '出售了' + reduce
                    }
                }
            }
            return {
                gname: gname,
                reduce: reduce,
                add: add,
                desc: str
            }
        },
        // 添加信息到库存信息表中
        async insertMessage(obj) {
            let commitArr = []
            if (!Array.isArray(obj)) {
                let handleObj = {
                    sname: obj.gname,
                    scountreduce: obj.reduce,
                    scountadd: obj.add,
                    sdate: moment().format("YYYY-MM-DD HH:mm:ss"),
                    sdesc: obj.desc
                }
                commitArr.push(handleObj)
            } else {
                let len = obj.length
                for (let i = 0; i < len; i++) {
                    commitArr.push({
                        sname: obj[i].gname,
                        scountreduce: obj[i].reduce,
                        scountadd: obj[i].add,
                        sdate: moment().format("YYYY-MM-DD HH:mm:ss"),
                        sdesc: obj[i].desc
                    })
                }
            }
            const res = await this.$http.post('addStoreMsg', commitArr)
        }
    },
};
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

.cancelbtn {
    margin-right: 50px;
}

.deldialog {
    border-radius: 28px;
    box-shadow: 3px 3px 6px black;
}

</style>
