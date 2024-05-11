<template>
  <section class="modules-wrap">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="botton-wrap">
        <el-button type="primary" @click.native="handleRefresh()" icon="el-icon-circle-plus-outline">刷新门店列表</el-button>
      </div>
    </div>

    <div class="search-bar">
      <div class="botton-wrap">
        <el-input clearable style="width:200px;" v-model="params.province_name" placeholder="省份"></el-input>
        <el-input clearable style="width:200px;" v-model="params.city_name" placeholder="城市"></el-input>
        <el-input clearable style="width:200px;" v-model="params.district_name" placeholder="地区"></el-input>
        <el-button class="filter-item" type="primary" @click.native="search(1)" icon="el-icon-search">搜索</el-button>
        <el-button type="text" @click.native="handleReset()">重置</el-button>
      </div>
    </div>

    <!-- 主内容表格 -->
    <el-table v-loading="loading" :data="table.data" :highlight-current-row="true" size="max" stripe tooltip-effect="dark" style="width: 100%;" :border="true">
      <el-table-column align="center" prop="province_name" label="省份"></el-table-column>
      <el-table-column align="center" prop="city_name" label="城市"></el-table-column>
      <el-table-column align="center" prop="district_name" label="地区"></el-table-column>
      <el-table-column align="center" prop="full_address" label="完整地址"></el-table-column>
      <el-table-column align="center" prop="name" label="名称"></el-table-column>
      <el-table-column align="center" prop="tenant_name" label="公司名称"></el-table-column>
      <el-table-column align="center" prop="create_date" :formatter="formatDate" label="创建时间"></el-table-column>
    </el-table>

    <PageView :total="table.total" :page="params.page"></PageView>
  </section>
</template>

<script>

import {pageShop, refreshShop} from "@/api/imt.js"
import {FormatJS, PageView} from '@/components/tools'

export default {
  name: 'shop_list',
  components: { PageView },
  mixins: [FormatJS],
  data() {
    return {
      loading: false,
      table: {
        data: [{}],
        total: 0,
      },
      params: {
        page: 1,
        size: 10,
      },
    }
  },
  created() {
    this.search()
  },
  methods: {
    /**
     * 查询
     */
    search(page) {
      this.loading = true
      if (page) {
        this.params.page = page
      }
      pageShop(this.deleteNullParam(this.params)).then((r) => {
        this.table.data = r.data.list ? r.data.list : []
        this.table.total = Number(r.data.total)
        this.loading = false
      })
        .catch(() => {
          this.table.data = []
          this.loading = false
        })
    },
    handleRefresh() {
      this.$confirm('是否刷新门店列表?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.loading = true
        refreshShop().then((r) => {
          this.$message({
            message: '刷新门店列表成功',
            type: 'success',
          })
          this.search()
        }).catch(() => {
          this.loading = false
        })
      })
    },
    /**
     * 点击重置按钮
     */
    handleReset() {
      this.params.province_name = null
      this.params.city_name = null
      this.params.district_name = null
      this.search()
    },
  },
}
</script>
