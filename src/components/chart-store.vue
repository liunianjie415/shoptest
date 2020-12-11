<template>
<div>
    <div style="border:1px solid black;height:535px">
        <span>库存子组件</span>
        <span>{{transdata}}</span>
    </div>
</div>
</template>

<script>
export default {
    name: 'chart-store',
    props: {
        transdata: {
            type: Object
        }
    },
    data() {
        return {

        }
    },
    methods: {}
}
</script>

<style>

</style>
