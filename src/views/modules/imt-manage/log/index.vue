<template>
  <section class="modules-wrap">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="botton-wrap">
        <el-input clearable style="width:200px;" v-model="params.mobile" placeholder="手机号"></el-input>
        <el-button class="filter-item" type="primary" @click.native="search(1)" icon="el-icon-search">搜索</el-button>
        <el-button type="danger" @click.native="handleBatchDelete()" icon="el-icon-delete">批量删除</el-button>
      </div>
    </div>

    <div class="search-bar">
      <div class="botton-wrap">
        筛选
        <el-select v-model="params.type" clearable @change="search(1)" placeholder="操作类型">
          <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
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
      <el-table-column align="center" prop="type" :formatter="(row, column) => formatValue(row, column, 'typeList')" label="操作类型"></el-table-column>
      <el-table-column align="center" prop="message" label="信息"></el-table-column>
      <el-table-column align="center" prop="state" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state == 'SUCCESS'" type="success">成功</el-tag>
          <el-tag v-if="scope.row.state == 'FAIL'" type="danger">失败</el-tag>
          <el-tag v-if="scope.row.state == 'NO'" type="info">未执行</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="create_date" :formatter="formatDate" label="操作时间"></el-table-column>
    </el-table>

    <PageView :total="table.total" :page="params.page"></PageView>
  </section>
</template>

<script>

import {pageLog, deleteLogs} from "@/api/imt.js"
import {FormatJS, PageView} from '@/components/tools'

export default {
  name: 'log_list',
  components: { PageView },
  mixins: [FormatJS],
  data() {
    return {
      loading: false,
      table: {
        data: [{}],
        total: 0,
      },
      timeParams: null,
      params: {
        page: 1,
        size: 10,
      },
      typeList: [
        {
          value: 'START_TRAVEL',
          name: '开始旅行',
        },
        {
          value: 'RECEIVE_ENERGY_AWARD',
          name: '领取申购耐力值',
        },
        {
          value: 'RECEIVE_SHARE_REWARD',
          name: '领取活动分享耐力值',
        },
        {
          value: 'RECEIVE_TRAVEL_REWARD',
          name: '领取旅行奖励小茅运',
        },
        {
          value: 'RECEIVE_CONTINUE_REWARD',
          name: '领取连续申购小茅运',
        },
        {
          value: 'ORDER_GIFT',
          name: '兑换权益',
        }
      ],
      stateList: [
        {
          value: 'SUCCESS',
          name: '成功',
        },
        {
          value: 'FAIL',
          name: '失败',
        },
        {
          value: 'NO',
          name: '未执行',
        }
      ],
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
      if (this.timeParams && this.timeParams.length > 0) {
        this.params.start_time = this.timeParams[0]
        this.params.end_time = this.timeParams[1]
      } else {
        this.params.start_time = null
        this.params.end_time = null
      }
      pageLog(this.deleteNullParam(this.params)).then((r) => {
        this.table.data = r.data.list ? r.data.list : []
        this.table.total = Number(r.data.total)
        this.loading = false
      })
      .catch(() => {
        this.table.data = []
        this.loading = false
      })
    },
    handleBatchDelete() {
      if (this.$refs.multipleTable.selection.length === 0) {
        this.$message({
          message: '请勾选日志再进行操作',
          type: 'warning'
        });
        return null
      }
      let ids = this.$refs.multipleTable.selection.map((item) => {
        return item.id
      })
      this.$confirm('是否删除勾选日志?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.loading = true
        deleteLogs(ids).then((r) => {
          this.$message({
            message: '删除日志成功',
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
      this.params.type = null
      this.params.state = null
      this.timeParams = null
      this.search()
    },
  },
}
</script>
