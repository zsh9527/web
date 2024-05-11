<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger :toggle-click="changeMenuState" :is-active="!hiddenMenu" class="hamburger-container"/>
    <breadcrumb/>
    <el-dropdown class="avatar-container" split-button size="medium" type="primary" @click="logout">
      登出
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import {mapState} from 'vuex'
import Breadcrumb from './Breadcrumb'
import Hamburger from './Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapState({
      hiddenMenu: state => state.hiddenMenu
    }),
  },
  methods: {
    changeMenuState() {
      this.$store.commit('changeMenuState')
    },
    logout() {
      this.$store.commit('changeToken', null)
      this.$router.push("/login");
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
  }
}
</style>

