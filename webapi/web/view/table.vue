<template lang="pug">
    mu-table(':enableSelectAll'="true" ':multiSelectable'="true")
        mu-thead
            mu-tr
                mu-th(v-for="item in titles") {{item}}
        mu-tbody
            mu-tr(v-for="item in data")
                mu-td(v-for="value in item") {{value}}
</template>
<script>
    export default {
        props:["titles","data"]
    }
</script>