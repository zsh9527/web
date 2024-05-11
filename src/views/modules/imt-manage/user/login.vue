<template>
  <section class="modules-wrap">
    <el-form ref="user" :model="user" label-width="200px" :rules="rules" v-loading="loading">
      <el-form-item>
        <el-button @click="sendCode()" type="primary">发送验证码</el-button>
      </el-form-item>
      <el-form-item label="验证码" prop="verify_code">
        <el-input type="text" v-model.trim="user.verify_code"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="refreshToken('user')" type="primary">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
        <el-button @click="cancel">取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
// 引入请求
import {sendCode, refreshToken} from "@/api/imt.js";

export default {
  name: 'user_refresh_token',
  props: {
    user: {}
  },
  data() {
    return {
      loading: false,
      rules: {
        verify_code: [{ required: true, message: '请输入登录验证码', trigger: 'blur' }],
      }
    }
  },
  methods: {
    sendCode() {
      sendCode(this.user.mobile).then(() => {
        this.loading = false
        this.$message({
          message: '发送验证成功',
          type: 'success',
        })
      })
      .catch(() => {
        this.loading = false
      })
    },
    refreshToken(user) {
      this.$refs[user].validate((valid) => {
        if (valid) {
          this.loading = true
          refreshToken(this.user.mobile, {"verify_code": this.user.verify_code}).then((data) => {
            this.loading = false
            this.$message({
              message: '重新登录成功',
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
