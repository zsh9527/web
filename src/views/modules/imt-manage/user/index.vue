<template>
  <section class="modules-wrap">
    <div v-show="mainDialog">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <div class="botton-wrap">
          <el-button type="primary" @click.native="handleAdd()" icon="el-icon-circle-plus-outline">新建用户</el-button>
          <el-button type="warning" @click.native="handleBatchReservation()" icon="el-icon-circle-plus-outline">批量申购</el-button>
          <el-button type="warning" @click.native="handleBatchReward()" icon="el-icon-circle-plus-outline">批量领取奖励</el-button>
          <el-button type="danger" @click.native="handleBatchDelete()" icon="el-icon-delete">批量删除</el-button>
        </div>
      </div>

      <div class="search-bar">
        <div class="botton-wrap">
          <el-input clearable style="width:200px;" v-model="params.mobile" placeholder="手机号"></el-input>
          <el-input clearable style="width:200px;" v-model="params.remark" placeholder="备注"></el-input>
          token过期
          <el-date-picker @change="search(1)" v-model="timeParams" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-ddTHH:mm:ss+08:00">
          </el-date-picker>
          <el-button class="filter-item" type="primary" @click.native="search(1)" icon="el-icon-search">搜索</el-button>
          <el-button type="text" @click.native="handleReset()">重置</el-button>
        </div>
      </div>

      <!-- 主内容表格 -->
      <el-table ref="multipleTable" v-loading="loading" :data="table.data" :highlight-current-row="true" size="max" stripe tooltip-effect="dark" style="width: 100%;" :border="true">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column align="center" prop="mobile" :formatter="formatMobile" label="手机号"></el-table-column>
        <el-table-column align="center" prop="item_codes" label="预约商品">
          <template slot-scope="scope">
            <div v-for="code in scope.row.item_codes" :key="code">{{ itemMap[code] }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="shop_type" :formatter="(row, column) => formatValue(row, column, 'shopTypeList')" label="门店预约类型"></el-table-column>
        <el-table-column align="center" prop="token_expire_time" :formatter="formatDate" label="token过期时间" sortable></el-table-column>
        <el-table-column align="center" prop="address" label="详细地址"></el-table-column>
        <el-table-column align="center" prop="notify_email" label="通知邮箱"></el-table-column>
        <el-table-column align="center" prop="remark" label="备注"></el-table-column>
        <el-table-column align="center" prop="create_date" :formatter="formatDate" label="创建时间" sortable></el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-dropdown split-button size="medium" type="primary" @command="command => handleCommand(scope.row, command)" @click="handleUpdate(scope.row)">
              修改
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="listItemShops">预约门店列表</el-dropdown-item>
                <el-dropdown-item command="refreshToken">重新登录imaotai</el-dropdown-item>
                <el-dropdown-item command="generateToken">生成授权token</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <PageView :total="table.total" :page="params.page"></PageView>

      <!-- 新增 -->
      <el-dialog title="新建用户" :visible.sync="addDialog" :close-on-click-modal="false">
        <add-view v-if="addDialog" @emitCancel="emitSave($event)"></add-view>
      </el-dialog>

      <!-- 更新 -->
      <el-dialog title="更新用户" :visible.sync="updateDialog" :close-on-click-modal="false">
        <update-view v-if="updateDialog" :user="user" :itemList="itemList" @emitCancel="emitCancel($event)" @emitSave="emitSave($event)"></update-view>
      </el-dialog>

      <!-- 登录 -->
      <el-dialog title="重新登录" :visible.sync="loginDialog" :close-on-click-modal="false">
        <login-view v-if="loginDialog" :user="user" @emitCancel="emitCancel($event)"  @emitSave="emitSave($event)"></login-view>
      </el-dialog>

      <!-- 授权 -->
      <el-dialog title="授权" :visible.sync="authDialog" :close-on-click-modal="false">
        <auth-view v-if="authDialog" :user="user" @emitCancel="emitCancel($event)"></auth-view>
      </el-dialog>
    </div>

    <!-- 跳转页面 -->
    <router-view v-if="!mainDialog"></router-view>

  </section>
</template>

<script>

import { pageUser, deleteUsers, listAllItem, reservation, reward } from "@/api/imt.js"
import AddView from './add'
import UpdateView from './update'
import LoginView from './login'
import AuthView from './auth'
import { FormatJS, PageView } from '@/components/tools'

export default {
  name: 'user_list',
  components: { PageView, AddView, UpdateView, LoginView, AuthView },
  mixins: [FormatJS],
  watch:{
    $route(to, from){
      if (from.path.startsWith(this.itemShopsPath)) {
        // 子页面back
        this.mainDialog = true
      }
    }
  },
  data() {
    return {
      loading: false,
      timeParams: null,
      itemShopsPath: "/imt-manage/user/item_shops",
      user: null,
      itemList: [],
      itemMap: {},
      table: {
        data: [{}],
        total: 0,
      },
      params: {
        page: 1,
        size: 10,
      },
      shopTypeList: [
        {
          value: 'NEAR',
          name: '附近门店',
        },
        {
          value: 'NUMBER',
          name: '本市出货量最大的门店',
        }
      ],
      mainDialog: true,
      addDialog: false,
      updateDialog: false,
      loginDialog: false,
      authDialog: false
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
    if (this.$route.path.startsWith(this.itemShopsPath)) {
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
      if (this.timeParams && this.timeParams.length > 0) {
        this.params.start_time = this.timeParams[0]
        this.params.end_time = this.timeParams[1]
      } else {
        this.params.start_time = null
        this.params.end_time = null
      }
      pageUser(this.deleteNullParam(this.params)).then((r) => {
        this.table.data = r.data.list ? r.data.list : []
        this.table.total = Number(r.data.total)
        this.loading = false
      })
      .catch(() => {
        this.table.data = []
        this.loading = false
      })
    },
    getSelectMobile() {
      if (this.$refs.multipleTable.selection.length === 0) {
        this.$message({
          message: '请勾选用户再进行操作',
          type: 'warning'
        });
        return null
      }
      return this.$refs.multipleTable.selection.map((item) => {
        return item.mobile
      })
    },
    /**
     * 点击新增
     */
    handleAdd() {
      this.addDialog = true
    },
    /**
     * 点击更新
     */
    handleUpdate(row) {
      this.user = JSON.parse(JSON.stringify(row))
      this.updateDialog = true
    },
    handleRefreshToken(row) {
      this.user = JSON.parse(JSON.stringify(row))
      this.loginDialog = true
    },
    handleGenerateToken(row) {
      this.user = JSON.parse(JSON.stringify(row))
      this.authDialog = true
    },
    handleBatchDelete() {
      let mobiles = this.getSelectMobile();
      if (!mobiles) {
        return;
      }
      this.$confirm('是否删除勾选用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.loading = true
        deleteUsers(mobiles).then((r) => {
          this.$message({
            message: '删除用户成功',
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
      this.params.remark = null
      this.timeParams = null
      this.search()
    },
    /**
     * 点击下拉操作按钮
     */
    handleCommand(row, command) {
      if (command === "listItemShops")  {
        this.listItemShops(row)
      } else if (command === "refreshToken")  {
        this.handleRefreshToken(row)
      } else if (command === "generateToken")  {
        this.handleGenerateToken(row)
      }
    },
    handleBatchReservation() {
      let mobiles = this.getSelectMobile();
      if (!mobiles) {
        return;
      }
      this.$confirm('是否执行勾选的申购任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.loading = true
        reservation(mobiles).then((r) => {
          this.$message({
            message: '申购任务执行成功',
            type: 'success',
          })
          this.search()
        }).catch(() => {
          this.loading = false
        })
      })
    },
    handleBatchReward() {
      let mobiles = this.getSelectMobile();
      if (!mobiles) {
        return;
      }
      this.$confirm('是否执行勾选的领取奖励任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.loading = true
        reward(mobiles).then((r) => {
          this.$message({
            message: '执行完成, 执行结果请在日志中查看',
            type: 'success',
          })
          this.search()
        }).catch(() => {
          this.loading = false
        })
      })
    },
    listItemShops(row) {
      this.$router.push(
        {
          path: this.itemShopsPath,
          query: { mobile: row.mobile, itemCodes: row.item_codes },
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
      this.addDialog = false
      this.updateDialog = false
      this.authDialog = false
    },
    /**
     * 取消
     */
    emitCancel() {
      this.addDialog = false
      this.updateDialog = false
      this.loginDialog = false
      this.authDialog = false
    },
  },
}
</script>
