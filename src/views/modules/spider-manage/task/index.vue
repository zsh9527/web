<template>
  <section class="modules-wrap">
    <div v-show="mainDialog">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <!-- 按钮操作 -->
        <div class="botton-wrap">
          <el-badge :value="table.taskCount" class="item">
            <el-button type="primary" @click.native="handleAdd()" icon="el-icon-circle-plus-outline">新建任务</el-button>
          </el-badge>
        </div>
      </div>

      <!-- 主内容表格 -->
      <el-table v-loading="loading" :data="table.data" :highlight-current-row="true" size="max" stripe tooltip-effect="dark" style="width: 100%;" :border="true">
        <el-table-column align="center" prop="task_name" label="任务名称"></el-table-column>
        <el-table-column align="center" :formatter="formatObject" prop="search_param" label="查询参数"  width="500"></el-table-column>
        <el-table-column align="center" prop="state" label="任务状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state == 'NORMAL'" type="success">运行中</el-tag>
            <el-tag v-if="scope.row.state == 'EXPIRE'">运行结束</el-tag>
            <el-tag v-if="scope.row.state == 'STOP'" type="danger">中止</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" :formatter="formatDate" prop="create_date" label="创建时间"></el-table-column>
        <el-table-column label="操作" align="center" width="450">
          <template slot-scope="scope">
            <el-badge :value="scope.row.task_count" class="item">
              <el-button @click.native="stopTask(scope.row)" type="danger" size="mini" icon="el-icon-tickets">中止任务</el-button>
            </el-badge>
            <el-badge :value="scope.row.engine_count" class="item">
              <el-button @click.native="listEngine(scope.row)" type="success" size="mini" icon="el-icon-tickets">引擎结果</el-button>
            </el-badge>
            <el-badge :value="scope.row.spider_count" class="item">
              <el-button @click.native="listSpider(scope.row)" type="success" size="mini" icon="el-icon-tickets">爬虫结果</el-button>
            </el-badge>
          </template>
        </el-table-column>
      </el-table>

      <PageView :total="table.total" :page="params.page"></PageView>

      <!-- 新增 -->
      <el-dialog title="新建任务" :visible.sync="dialog" :close-on-click-modal="false">
        <add-view v-if="dialog" @emitSave="emitSave($event)" @emitCancel="emitCancel($event)"></add-view>
      </el-dialog>
    </div>

    <!-- 跳转页面 -->
    <router-view v-if="!mainDialog"></router-view>

  </section>
</template>

<style>
.item {
  margin-top: 10px;
  margin-right: 20px;
}
</style>
<script>

import { pageTask, stopTask } from "@/api/spider.js";
import AddView from './add'
import { FormatJS, PageView } from '@/components/tools'

export default {
  name: 'task_list',
  components: { PageView, AddView },
  mixins: [FormatJS],
  watch:{
    $route(to, from){
      if (from.path.startsWith(this.enginePath) || from.path.startsWith(this.spiderPath)) {
        // 子页面back
        this.mainDialog = true
      }
    }
  },
  data() {
    return {
      loading: false,
      enginePath: "/spider-manage/result/engine",
      spiderPath: "/spider-manage/result/spider",
      table: {
        data: [{}],
        total: 0,
        taskCount: 0,
      },
      params: {
        page: 1,
        size: 10,
      },
      mainDialog: true,
      dialog: false
    }
  },
  created() {
    this.search()
    if (this.$route.path.startsWith(this.enginePath)
      || this.$route.path.startsWith(this.spiderPath)) {
      this.mainDialog = false
    }
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
      pageTask(this.params).then((r) => {
        this.table.data = r.data.list ? r.data.list : []
        this.table.total = Number(r.data.total)
        this.table.taskCount = Number(r.data.task_count)
        this.loading = false
      })
        .catch(() => {
          this.table.data = []
          this.loading = false
        })
    },
    /**
     * 点击新增
     */
    handleAdd() {
      this.dialog = true
    },
    stopTask(row) {
      this.$confirm('是否中止此任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.loading = true
        stopTask(row.id).then((r) => {
          this.$message({
            message: '中止任务成功',
            type: 'success',
          })
          this.search()
        }).catch(() => {
          this.loading = false
        })
      })
    },
    listEngine(row) {
      this.$router.push(
        {
          path: this.enginePath,
          query: { taskId: row.id },
        },
        () => {
          this.mainDialog = false
        }
      )
    },
    listSpider(row) {
      this.$router.push(
        {
          path: this.spiderPath,
          query: { taskId: row.id },
        },
        () => {
          this.mainDialog = false
        }
      )
    },
    /**
     * 保存后处理
     */
    emitSave() {
      this.search()
      this.dialog = false
    },
    /**
     * 取消
     */
    emitCancel() {
      this.dialog = false
    },
  },
}
</script>
