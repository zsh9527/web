<template>
  <section class="modules-wrap">
    <el-form ref="user" :model="user" label-width="200px" :rules="rules" v-loading="loading">
      <el-form-item label="手机号" prop="mobile">
        <el-input type="text" v-model="user.mobile" disabled></el-input>
      </el-form-item>
      <el-form-item label="预约商品" prop="item_codes">
        <el-checkbox-group v-model="user.item_codes">
          <el-checkbox v-for="(item, index) in itemList" :key="index" :label="item.item_code">
            {{ item.title }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="门店预约类型" prop="shop_type">
        <el-select v-model="user.shop_type">
          <el-option v-for="(item, index) in shopTypeList" :key="index" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通知邮箱" prop="notify_email">
        <el-input type="text" v-model="user.notify_email"></el-input>
      </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="text" v-model="user.remark"></el-input>
        </el-form-item>
      <el-form-item>
        <el-button @click="update('user')" type="primary">确&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;认</el-button>
        <el-button @click="cancel">取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
// 引入请求
import { updateUser } from "@/api/imt.js";

export default {
  name: 'update_user',
  props: {
    user: {},
    itemList: [],
  },
  data() {
    return {
      loading: false,
      rules: {
        item_codes: [{ required: true, message: '请选择预约商品', trigger: 'blur' }],
        shop_type: [{ required: true, message: '请选择门店预约类型', trigger: 'blur' }],
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
      ]
    }
  },
  methods: {
    update(user) {
      this.$refs[user].validate((valid) => {
        if (valid) {
          this.loading = true
          updateUser(this.user.mobile, this.user).then((data) => {
            this.loading = false
            this.$message({
              message: '更新成功',
              type: 'success',
            })
            this.$emit('emitSave', this.user)
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
