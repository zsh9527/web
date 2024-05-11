<template>
  <div class="login-container">

    <div class="login-form" auto-complete="on" label-position="left">
      <el-form ref="login" :model="login" :rules="loginRules">
        <div style="text-align: center; margin-bottom: 30px;">
          <el-radio-group v-model="login.loginType">
            <el-radio label="auth">授权登陆</el-radio>
            <el-radio label="username">账号密码登陆</el-radio>
          </el-radio-group>
        </div>

        <div v-if="login.loginType === 'auth'">
          <h3 class="title">授权登陆</h3>
          <el-form-item prop="token">
            <span class="svg-container">
              <svg-icon icon-class="user"/>
            </span>
            <el-input v-model.trim="login.token" name="token" type="text" auto-complete="on" placeholder="请输入授权token"/>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleAuth">
              授权
            </el-button>
          </el-form-item>
        </div>

        <div v-else>
          <h3 class="title">账号密码登陆</h3>
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user"/>
            </span>
            <el-input v-model.trim="login.username" name="username" type="text" auto-complete="on" placeholder="请输入用户名或手机号"/>
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password"/>
            </span>
            <el-input
              :type="pwdType"
              v-model.trim="login.password"
              name="password"
              auto-complete="on"
              placeholder="password"
              @keyup.enter.native="handleLogin"/>
            <span class="show-pwd" @click="showPwd">
              <svg-icon icon-class="eye"/>
            </span>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
              登陆
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login, verifyToken } from '@/api/login.js'

export default {
  name: 'login',
  data() {
    return {
      login: {
        loginType: this.$store.state.loginType
      },
      loginRules: {
        token: [{required: true, trigger: 'blur'}],
        username: [{required: true, trigger: 'blur', message: '请输入用户名或手机号'}],
        password: [{required: true, trigger: 'blur', message: '请输入密码'}]
      },
      loading: false,
      pwdType: 'password',
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleAuth() {
      this.$refs.login.validate(valid => {
        if (valid) {
          this.loading = true
          verifyToken({token: this.login.token}).then(() => {
            this.$store.commit('changeLoginType', this.login.loginType)
            this.$store.commit('changeToken', this.login.token);
            this.loading = false
            this.$router.push({path: '/'})
          })
          .catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    handleLogin() {
      this.$refs.login.validate(valid => {
        if (valid) {
          this.loading = true
          const crypto = require('crypto');
          const hash = crypto.createHash('md5');
          hash.update(this.login.password);
          const md5Hex = hash.digest('hex');
          login({"username": this.login.username, "password": md5Hex}).then((r) => {
            this.$store.commit('changeLoginType', this.login.loginType)
            this.$store.commit('changeToken', r.data.token);
            this.loading = false
            this.$router.push({path: '/'})
          })
          .catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;

      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;

  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
