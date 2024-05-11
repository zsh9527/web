<template>
  <section class="modules-wrap">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="botton-wrap">
        <el-button type="primary" @click.native="handleRefresh()" icon="el-icon-circle-plus-outline">刷新商品列表</el-button>
      </div>
    </div>

    <!-- 主内容表格 -->
    <el-table v-loading="loading" :data="table.data" :highlight-current-row="true" size="max" stripe tooltip-effect="dark" style="width: 100%;" :border="true">
      <el-table-column align="center" prop="item_code" label="商品code"></el-table-column>
      <el-table-column align="center" prop="title" label="商品标题"></el-table-column>
      <el-table-column align="center" prop="picture" label="商品图片">
        <template slot-scope="scope">
          <el-image style="width: 100px; height: 100px" :src="scope.row.picture" fit="scale-down" v-if="scope.row.picture"></el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="check_date" :formatter="formatDate" label="刷新时间" sortable></el-table-column>
      <el-table-column align="center" prop="create_date" :formatter="formatDate" label="创建时间" sortable></el-table-column>
    </el-table>
  </section>
</template>

<script>

import {listAllItem, refreshItem} from "@/api/imt.js"
import {FormatJS} from '@/components/tools'

export default {
  name: 'item_list',
  mixins: [FormatJS],
  data() {
    return {
      loading: false,
      table: {
        data: [{}],
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
    search() {
      this.loading = true
      listAllItem().then((r) => {
        this.table.data = r.data ? r.data : []
        this.loading = false
      })
      .catch(() => {
        this.table.data = []
        this.loading = false
      })
    },
    handleRefresh() {
      this.$confirm('是否刷新商品列表?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.loading = true
        refreshItem().then((r) => {
          this.$message({
            message: '刷新商品列表成功',
            type: 'success',
          })
          this.search()
        }).catch(() => {
          this.loading = false
        })
      })
    },
  },
}
</script>
