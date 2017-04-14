<template lang="pug">
    #app
        mu-appbar(title="MDZZ")
            mu-icon-button(icon="menu" slot="left")
            mu-text-field(icon="search" v-model="memberCode" class="appbar-search-field"  hintText="请输入memberCode")
            mu-flat-button(color="white" label="查询"  @click="getToken")
            mu-text-field(v-model="token" )
        div(style="display:flex")
            mu-flat-button(label="config" style="margin:12px" @click="getConfig")
            mu-flat-button(label="webConfig" style="margin:12px" @click="getWebConfig")
            mu-flat-button(label="PM2List" style="margin:12px" @click="getPM2List")
        div
            mu-sub-header {{resultTitle}}
            mu-content-block(v-html="resultContent")
</template>
<script>
    import App from './app.js'
    export default App
</script>
<!-- style lang="less">
.appbar-search-field{
  color: #FFF;
  margin-bottom: 0;
  &.focus-state {
    color: #FFF;
  }
  .mu-text-field-hint {
    color: fade(#FFF, 54%);
  }
  .mu-text-field-input {
    color: #FFF;
  }
  .mu-text-field-focus-line {
    background-color: #FFF;
  }
}
</style -->