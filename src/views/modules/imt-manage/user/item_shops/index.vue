<template>
  <section class="modules-wrap">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="botton-wrap">
        <el-button type="primary" plain @click.native="handleBack()" icon="el-icon-back" style="margin-right: 10px">返回</el-button>
        <el-select v-model="params.item_code" clearable @change="search(1)">
          <el-option v-for="(item, index) in itemList" :key="index" :label="item.title" :value="item.item_code">
          </el-option>
        </el-select>
      </div>
    </div>

    <!-- 主内容表格 -->
    <el-table v-loading="loading" :row-class-name="rowClassName" :data="table.data" size="max" stripe style="width: 100%;" :border="true">
      <el-table-column align="center" prop="item_code" label="商品标题" sortable></el-table-column>
      <el-table-column align="center" prop="shop_id" label="商店ID" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.recommend">
            {{ scope.row.shop_id }}(推荐门店)
          </span>
          <span v-else>
            {{ scope.row.shop_id }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="inventory" label="库存" sortable></el-table-column>
      <el-table-column align="center" prop="count" label="已预约数量" sortable></el-table-column>
      <el-table-column align="center" prop="distance" label="距离(千米)" sortable></el-table-column>
      <el-table-column align="center" prop="shop_full_address" label="商店地址"></el-table-column>
    </el-table>
  </section>
</template>

<style>
.el-table .success-row {
  background: #9E9E9E;
}
</style>
<script>

import { listAllItem, listItemShops } from "@/api/imt.js"
import {FormatJS} from '@/components/tools'

export default {
  name: 'item_shop_list',
  mixins: [FormatJS],
  data() {
    return {
      loading: false,
      mobile: null,
      itemCodes: [],
      itemList: [],
      table: {
        data: [{}],
      },
      params: {},
    }
  },
  created() {
    this.mobile = this.$route.query.mobile
    this.itemCodes = this.$route.query.itemCodes
    listAllItem().then((r) => {
      this.itemList = r.data.filter(item => this.itemCodes.includes(item.item_code));
      this.search()
    })
    .catch(() => {
      this.itemList = []
    })
  },
  methods: {
    rowClassName(row) {
      return row.row.recommend ? 'success-row' : ''; // 如果 recommend 为 true，返回 red-row 类名，否则返回空字符串
    },
    /**
     * 查询
     */
    search() {
      this.loading = true
      listItemShops(this.mobile, this.deleteNullParam(this.params)).then((r) => {
        this.table.data = r.data ? r.data : []
        this.loading = false
      })
      .catch(() => {
        this.table.data = []
        this.loading = false
      })
    },
    /**
     * 点击返回
     */
    handleBack() {
      this.$router.go(-1)
    },
  },
}
</script>
