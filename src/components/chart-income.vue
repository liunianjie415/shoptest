<template>
<div>
    <div style="border:1px solid black;height:535px">
        <span>收入</span>
        <span>{{transdata}}</span>
    </div>
</div>
</template>

<script>
export default {
    name: 'chart-income',
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
