<template>
  <section class="modules-wrap">
    <el-form ref="user" :model="user" label-width="200px" :rules="rules" v-loading="loading">
      <el-form-item label="过期时间" prop="expire_time">
        <el-radio-group v-model="user.expire_time">
          <el-radio label='DAY'>一天</el-radio>
          <el-radio label='MONTH'>一个月</el-radio>
          <el-radio label='YEAR'>一年</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button @click="generateToken('user')" type="primary">确&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;认</el-button>
        <el-button @click="cancel">取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</el-button>
      </el-form-item>

      <el-form-item label="授权token" prop="token">
        <el-input type="textarea" v-model.trim="user.token"></el-input>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
// 引入请求
import {generateToken} from "@/api/login.js";

export default {
  name: 'user_generate_token',
  props: {
    user: {}
  },
  data() {
    return {
      loading: false,
      rules: {
        expire_time: [{ required: true, message: '请选择过期时间', trigger: 'blur' }],
      }
    }
  },
  methods: {
    generateToken(user) {
      this.$refs[user].validate((valid) => {
        if (valid) {
          this.loading = true
          generateToken( this.user.mobile, {"expire_time": this.user.expire_time}).then((r) => {
            this.loading = false
            this.user.token = r.data.token
            this.$message({
              message: '生成成功',
              type: 'success',
            })
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
