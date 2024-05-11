<template>
  <!-- 分页栏  -->
  <section class="pagination">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="page" :page-sizes="[1, 5, 10,20,50,100]" :page-size="size" :total="total"
                   layout="total, sizes, prev, pager, next"></el-pagination>
  </section>
</template>
<!--依赖父组件的search方法及params-->
<script>
export default {
  props: {
    page: {
      type: Number,
      default: 1,
    },
    size: {
      type: Number,
      default: 10,
    },
    total: Number,
  },
  methods: {
    /**
     * 切换每页条数
     */
    handleSizeChange(val) {
      this.$parent.params.size = val
      this.$parent.params.page = 1
      this.$parent.search()
    },
    /**
     * 切换页码
     */
    handleCurrentChange(val) {
      this.$parent.params.page = val
      this.$parent.search()
    },
  },
}
</script>
