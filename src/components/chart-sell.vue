<template>
<div>
    <div style="border:1px solid black;height:535px" ref="sell_ref">
        <span>销量子组件</span>
        <span>{{transdata}}</span>
    </div>
</div>
</template>

<script>
export default {
    name: 'chart-sell',
    props: {
        transdata: {
            type: Object
        }
    },
    data() {
        return {
            chartInstance: null,
            // 类别名称及其包含的商品
            allTgoods: [],
            // 服务端获取来的销售数据
            selldata:[]
        }
    },
    created() {
        this.getGtype()
    },
    mounted() {
        this.initChart()
        this.getData()
    },
    methods: {
        // 初始化echartInstance对象
        initChart() {
            // this.chartInstance = this.$echarts.init(this.$refs.sell_ref)
        },
        // 获取服务器数据
        async getData() {
            const {data: ret} = await this.$http.get('getSellStoreMsg')
            this.selldata = ret
            console.log(this.selldata)
            this.updateChart()
        },
        // 更新图表
        updateChart() {
            // const option = {

            // }
            // this.chartInstance.setOption(option)
        },
        // 获取类别表及其商品
        async getGtype() {
            const res = await this.$http.get('showGoodstype')
            let data = res.data
            let resArr = []
            data.forEach(e => {
                for (let i = 0; i < resArr.length; i++) {
                    if (resArr[i].typename == e.gtname) {
                        resArr[i].goodsname.push({
                            value: e.gname
                        })
                        return
                    }
                }
                resArr.push({
                    typename: e.gtname,
                    goodsname: [{
                        value: e.gname
                    }]
                })
            })
            this.allTgoods = resArr 
        },
    }
}
</script>

<style>

</style>
