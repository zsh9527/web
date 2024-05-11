<template>
  <section class="modules-wrap">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="botton-wrap">
        <el-input clearable style="width:200px;" v-model="params.mobile" placeholder="手机号"></el-input>
        <el-button class="filter-item" type="primary" @click.native="search(1)" icon="el-icon-search">搜索</el-button>
        <el-button type="warning" @click.native="handleUpdateReservationResult()" icon="el-icon-edit">查询申购结果</el-button>
      </div>
    </div>

    <div class="search-bar">
      <div class="botton-wrap">
        筛选
        <el-select v-model="params.state" clearable @change="search(1)" placeholder="状态">
          <el-option v-for="item in stateList" :key="item.id" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker @change="search(1)" v-model="timeParams" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-ddTHH:mm:ss+08:00">
        </el-date-picker>
        <el-button type="text" @click.native="handleReset()">重置</el-button>
      </div>
    </div>

    <!-- 主内容表格 -->
    <el-table ref="multipleTable" v-loading="loading" :data="table.data" :highlight-current-row="true" size="max" stripe tooltip-effect="dark" style="width: 100%;" :border="true">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column align="center" prop="mobile" :formatter="formatMobile" label="手机号"></el-table-column>
      <el-table-column align="center" prop="item_code" label="申购商品">
        <template slot-scope="scope">
          <span>{{ itemMap[scope.row.item_code] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="shop_id" label="门店ID"></el-table-column>
      <el-table-column align="center" prop="state" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state == 'CREATE'" type="warning">申购中</el-tag>
          <el-tag v-if="scope.row.state == 'CREATE_FAIL'" type="danger">操作失败</el-tag>
          <el-tag v-if="scope.row.state == 'SUCCESS'" type="success">申购成功</el-tag>
          <el-tag v-if="scope.row.state == 'FAIL'" type="info">申购失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="fail_message" label="失败信息"></el-table-column>
      <el-table-column align="center" prop="create_date" :formatter="formatDate" label="申购时间"></el-table-column>
    </el-table>

    <PageView :total="table.total" :page="params.page"></PageView>
  </section>
</template>

<script>

import {pageOrder, updateReservationResult,listAllItem} from "@/api/imt.js"
import {FormatJS, PageView} from '@/components/tools'

export default {
  name: 'order_list',
  components: { PageView },
  mixins: [FormatJS],
  data() {
    return {
      loading: false,
      itemList: [],
      itemMap: {},
      table: {
        data: [{}],
        total: 0,
      },
      timeParams: null,
      params: {
        page: 1,
        size: 10,
      },
      stateList: [
        {
          value: 'CREATE',
          name: '申购中',
        },
        {
          value: 'CREATE_FAIL',
          name: '操作失败',
        },
        {
          value: 'SUCCESS',
          name: '申购成功',
        },
        {
          value: 'FAIL',
          name: '申购失败',
        },
      ],
    }
  },
  created() {
    listAllItem().then((r) => {
      this.itemList = r.data
      this.itemMap = this.itemList.reduce(function(acc, role) {
        acc[role.item_code] = role.title;
        return acc;
      }, {});
      this.search()
    })
    .catch(() => {
      this.itemList = []
    })
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
      if (this.timeParams && this.timeParams.length > 0) {
        this.params.start_time = this.timeParams[0]
        this.params.end_time = this.timeParams[1]
      } else {
        this.params.start_time = null
        this.params.end_time = null
      }
      pageOrder(this.deleteNullParam(this.params)).then((r) => {
        this.table.data = r.data.list ? r.data.list : []
        this.table.total = Number(r.data.total)
        this.loading = false
      })
      .catch(() => {
        this.table.data = []
        this.loading = false
      })
    },
    handleUpdateReservationResult() {
      if (this.$refs.multipleTable.selection.length === 0) {
        this.$message({
          message: '请勾选用户再进行操作',
          type: 'warning'
        });
        return null
      }
      let mobiles = this.$refs.multipleTable.selection.map((item) => {
        return item.mobile
      })
      this.$confirm('是否查询勾选申购结果?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.loading = true
        updateReservationResult(mobiles).then((r) => {
          this.$message({
            message: '更新申购结果成功',
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
      this.params.mobile = null
      this.params.state = null
      this.timeParams = null
      this.search()
    },
  },
}
</script>
