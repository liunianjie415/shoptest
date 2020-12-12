<template>
<div>
    <div style="border:1px solid black;height:535px">
        <span>{{transselldata}}</span>
    </div>
</div>
</template>

<script>
export default {
    name: 'chart-sell',
    props: {
        transselldata: {
            type: Array,
            default:()=>[]
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
