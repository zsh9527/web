<template>
  <section class="modules-wrap">
    <el-form ref="task" :model="task" label-width="200px" :rules="rules" v-loading="loading">
      <el-form-item label="关键字" prop="key_word">
        <el-input type="text" v-model="task.key_word"></el-input>
      </el-form-item>
      <el-form-item label="匹配的完整关键字" prop="all_key_word">
        <el-input type="text" v-model="task.all_key_word"></el-input>
      </el-form-item>
      <el-form-item label="匹配的任意关键字" prop="any_key_word">
        <el-input type="text" v-model="task.any_key_word" placeholder="多个关键字空格分离"></el-input>
      </el-form-item>
      <el-form-item label="不包含的关键字" prop="no_key_word">
        <el-input type="text" v-model="task.no_key_word" placeholder="多个关键字空格分离"></el-input>
      </el-form-item>
      <el-form-item label="不包含的关键字" prop="no_key_word">
        <el-input type="text" v-model="task.no_key_word" placeholder="多个关键字空格分离"></el-input>
      </el-form-item>
      <el-form-item label="文件类型" prop="file_type">
        <el-select v-model="task.file_type" clearable>
          <el-option v-for="(item, index) in fileTypeList" :key="index" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="限制搜索网站" prop="limit_site">
        <el-input type="text" v-model="task.limit_site" placeholder="ex: baidu.com"></el-input>
      </el-form-item>
      <el-form-item label="限制时间" prop="limit_time">
        <el-select v-model="task.limit_time" clearable>
          <el-option v-for="(item, index) in limitTimeList" :key="index" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="限制结果语言" prop="limit_chinese">
        <el-radio-group v-model="task.limit_chinese">
          <el-radio :label=false>不限制语言</el-radio>
          <el-radio :label=true>简体中文</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="每个搜索引擎最大爬取数量" prop="max_search_size">
        <el-input type="text" v-model.number="task.max_search_size" maxlength="5" placeholder="请输入大于0整数"></el-input>
      </el-form-item>
      <el-form-item label="爬取规则" prop="deep_search">
        <el-radio-group v-model="task.deep_search">
          <el-radio :label=true>深层爬取</el-radio>
          <el-radio :label=false>只爬取搜索引擎</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否严格检查下一级URL" prop="strict_child_url">
        <el-radio-group v-model="task.strict_child_url">
          <el-radio :label=false>否</el-radio>
          <el-radio :label=true>是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="忽略网站(深层爬取时生效)" prop="ignore_spider_site">
        <el-input type="text" v-model="task.ignore_spider_site" placeholder="多个网站空格分离"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="add('task')" type="primary">确&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;认</el-button>
        <el-button @click="cancel">取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
// 引入请求
import { addTask } from "@/api/spider.js";

export default {
  name: 'add_task',
  data() {
    return {
      loading: false,
      task: {
        limit_chinese: false,
        max_search_size: 100,
        deep_search: true,
        strict_child_url: false,
      },
      rules: {
        limit_chinese: [{ required: true, message: '请选择限制结果语言', trigger: 'blur' }],
        max_search_size: [
          { required: true, message: '请输入大于0整数', trigger: 'blur' },
          { message: '请输入大于0整数', pattern: /^[1-9]\d*$/, trigger: 'blur'}
        ],
        deep_search: [{ required: true, message: '请选择爬取规则', trigger: 'blur' }],
        strict_child_url: [{ required: true, message: '请选择是否严格检查下一级URL', trigger: 'blur' }],
      },
      fileTypeList: [
        {
          value: 'PDF',
          name: 'pdf文件',
        },
        {
          value: 'WORD',
          name: 'word文件',
        },
        {
          value: 'EXCEL',
          name: 'excel文件',
        },
      ],
      limitTimeList: [
        {
          value: 'DAY',
          name: '一天内',
        },
        {
          value: 'WEEK',
          name: '一周内',
        },
        {
          value: 'MONTH',
          name: '一个月内',
        },
        {
          value: 'YEAR',
          name: '一年内',
        },
      ],
    }
  },
  methods: {
    add(task) {
      this.$refs[task].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.task.ignore_spider_site) {
            this.task.ignore_spider_site = this.task.ignore_spider_site.split(' ');
          }
          addTask(this.task).then((data) => {
            this.loading = false
            this.$message({
              message: '新建任务成功',
              type: 'success',
            })
            this.$emit('emitSave')
          })
          .catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$emit('emitCancel')
    }
  }
}
</script>
