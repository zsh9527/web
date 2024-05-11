<template>
  <section class="modules-wrap">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="botton-wrap">
        <el-button type="primary" plain @click.native="handleBack()" icon="el-icon-back" style="margin-right: 10px">返回</el-button>
        搜索引擎
        <el-select v-model="params.engine_name" clearable @change="search(1)">
          <el-option v-for="item in engineList" :key="item.id" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
        <el-input clearable style="width:200px;" v-model="params.score" placeholder="最小匹配分数"></el-input>
        <el-input clearable style="width:200px;" v-model="params.content" placeholder="包含内容"></el-input>
        <el-button class="filter-item" type="primary" @click.native="search(1)" icon="el-icon-search">搜索</el-button>
      </div>
    </div>

    <!-- 主内容表格 -->
    <el-table v-loading="loading" :data="table.data" :highlight-current-row="true" size="max" stripe
              tooltip-effect="dark" style="width: 100%;" @sort-change="sortChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="页面链接">
              <span>{{ props.row.url }}</span>
            </el-form-item>
            <br/>
            <el-form-item label="子链接">
              <span>{{ props.row.child_url }}</span>
            </el-form-item>
            <br/>
            <el-form-item label="页面内容">
              <span>{{ props.row.content }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="source_engine_name" :formatter="(row, column) => formatValue(row, column, 'engineList')" label="搜索引擎" width="150"></el-table-column>
      <el-table-column align="center" prop="title" label="标题" width="350">
        <template slot-scope="scope">
          <a :href="scope.row.url" target="_blank">{{ scope.row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="parent_url" label="父级URL" width="200" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <a :href="scope.row.parent_url" target="_blank">{{ scope.row.parent_url }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="small_content" label="页面内容" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" prop="match_content" label="匹配的部分内容" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" prop="create_date" :formatter="formatDate" label="爬取时间" sortable="custom"></el-table-column>
      <el-table-column align="center" prop="similar_score" label="内容关联分数" width="120" sortable="custom"></el-table-column>
    </el-table>

    <PageView :total="table.total" :page="params.page"></PageView>

  </section>
</template>
<script>
// 引入依赖
import { FormatJS, PageView } from '@/components/tools'
import { pageSpider } from '@/api/spider.js'

export default {
  name: 'engine_list',
  components: { PageView },
  mixins: [FormatJS],
  data() {
    return {
      loading: false,
      engineList: [
        {
          value: 'BaiDu',
          name: '百度',
        },
        {
          value: 'Bing',
          name: '必应',
        },
        {
          value: 'ChinaSo',
          name: '中国搜索',
        },
        {
          value: 'Google',
          name: '谷歌',
        },
        {
          value: '360',
          name: '360搜索',
        },
        {
          value: 'Sougou',
          name: '搜狗搜索',
        },
        {
          value: 'Yahoo',
          name: '雅虎',
        },
        {
          value: 'Yandex',
          name: '俄罗斯Yandex',
        }
      ],
      params: {
        page: 1,
        size: 10,
        score: 0.001
      },
      table: {
        data: [{}],
        total: 0,
      },
    }
  },
  created() {
    this.params.task_id = this.$route.query.taskId
    this.search()
  },
  methods: {
    /**
     * 分页查询, 默认从第一页查询
     */
    search(page) {
      this.loading = true
      if (page) {
        this.params.page = page
      }
      pageSpider(this.deleteNullParam(this.params))
        .then((r) => {
          this.table.data = r.data.list ? r.data.list : []
          this.table.total = Number(r.data.total)
          this.loading = false
        })
        .catch((error) => {
          this.table.data = [];
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 排序事件
    sortChange(column, prop, order) {
      if (column.order) {
        this.params.order_by = column.prop
        if (column.order == 'ascending') {
          this.params.order_direction = 'ASC'
        } else {
          this.params.order_direction = 'DESC'
        }
      } else {
        delete this.params.order_by
        delete this.params.order_direction
      }
      this.search(1)
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
