<template>
  <section class="modules-wrap">
    <el-table :data="tableData" style="width: 100%" :show-header=false>
      <el-table-column label="发送方" width="180">
      <template slot-scope="scope">
        <span style="font-size: 14px;">{{ scope.row.sender }}</span>
      </template>
      </el-table-column>
      <el-table-column label="内容">
        <template slot-scope="scope">
          <span style="font-weight: bold;color:red" v-if="scope.row.sender == '系统'">{{ scope.row.content }}</span>
          <span style="font-weight: bold;" v-else>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top:20px;display: inline-block">
      <el-input v-model="sendMessage" @keyup.enter.native="handleSendMessage"></el-input>
      <el-button @click.native="handleSendMessage" type="primary">发送</el-button>
    </div>

    <div>
      <el-button @click="cancel" style="margin-top:20px">关&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;闭</el-button>
    </div>
  </section>
</template>

<style>
.el-input {
  width: 600px;
}
</style>

<script>
// 引入请求

export default {
  name: 'add_user',
  data() {
    return {
      // 定义ws对象
      webSocket: null,
      // ws定时器
      wsTimer: null,
      tableData: [],
      sendMessage: null,
    }
  },
  async mounted() {
    this.wsInit()
  },
  beforeDestroy() {
    this.wsOldDestroy();
  },
  methods: {
    wsInit() {
      // 销毁旧的ws
      this.wsOldDestroy()

      let base_location = process.env.BASE_URL
      let wsUri = base_location.replace("https", "ws").replace("http", "ws") + "websocket/user"
      // 初始化ws
      this.webSocket = new WebSocket(wsUri)
      // ws服务端给客户端推送消息
      this.webSocket.addEventListener('message', this.wsMessageHandler)
      // ws通信发生错误时触发
      this.webSocket.addEventListener('error', this.wsErrorHandler)
      // ws关闭时触发
      this.webSocket.addEventListener('close', this.wsCloseHandler)

      // 检查ws连接状态,readyState值为 0表示尚未连接，1表示建立连接，2正在关闭连接，3已经关闭或无法打开
      this.wsTimer = setInterval(() => {
        if (this.webSocket.readyState === 1) {
          // 发送心跳
          this.webSocket.send("ping");
        } else {
          this.$message({
            message: '连接中断或连接失败, 重试',
            type: 'error',
          })
          this.wsInit();
        }
      }, 5000)
    },
    wsMessageHandler(e) {
      this.tableData.push({"sender": "系统", content: e.data})
    },
    handleSendMessage() {
      if (this.sendMessage) {
        this.tableData.push({"sender": "", content: this.sendMessage})
        this.webSocket.send(this.sendMessage);
        this.sendMessage = null
      }
    },
    /**
     * ws通信发生错误
     */
    wsErrorHandler(event) {
      this.$message({
        message: '连接通道错误, 重试',
        type: 'error',
      })
      this.wsInit()
    },
    /**
     * ws关闭
     */
    wsCloseHandler(event) {
      this.$message({
        message: '连接通道关闭, 重试',
        type: 'error',
      })
      this.wsInit()
    },
    /**
     * 销毁旧的ws
     */
    wsOldDestroy() {
      if (this.webSocket !== null) {
        this.webSocket.removeEventListener('message', this.wsMessageHandler)
        this.webSocket.removeEventListener('error', this.wsErrorHandler)
        this.webSocket.removeEventListener('close', this.wsCloseHandler)
        this.webSocket.close()
        this.webSocket = null
        clearInterval(this.wsTimer)
      }
    },
    cancel() {
      this.wsOldDestroy()
      this.$emit('emitCancel')
    }
  }
}
</script>
