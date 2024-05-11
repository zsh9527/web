<template>
  <div class="app-wrapper" :class="classObj">
    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <navbar/>
      <app-main/>
    </div>
  </div>
</template>

<script>
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import AppMain from './AppMain'
import {mapState} from "vuex";

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  computed: {
    ...mapState({
      hiddenMenu: state => state.hiddenMenu
    }),
    classObj() {
      return {
        hideSidebar: this.hiddenMenu,
        openSidebar: !this.hiddenMenu,
      }
    }
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
