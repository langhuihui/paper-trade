<template lang="pug">
    mu-table
        mu-thead
            mu-tr
                mu-th(v-for="item in titles") {{item}}
        mu-tbody
            mu-tr(v-for="item in data")
                mu-td(v-for="value in item") {{value}}
</template>
<script>
    export default {
        data:function(){
            return {titles:[],data:[]}
        }
    }
</script>