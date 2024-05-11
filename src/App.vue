<template>
  <div id="app">
    <!-- 主视图层 -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<!-- 防止打开dialog关闭主页面滚动条 -->
<style>
body {
  overflow-y: auto !important;
  padding-right: 0 !important;
}
</style>
