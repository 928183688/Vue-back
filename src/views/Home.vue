<template>
  <div class="home">
    <el-container>
      <el-aside width="200px">
        <img src="../assets/5.jpg" alt class="logo">
        <el-menu
          :router="true"
          :unique-opened="true"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
        >
          <!-- 用户管理 -->
          <el-submenu :index="item.id + ''" v-for="item in meusList" :key="item.id">
            <template slot="title">
              <i class="el-icon-eleme"></i>
              <span>{{item.authName}}</span>
            </template>
              <el-menu-item :index="'/home/'+second.path" v-for="second in item.children" :key="second.id">
              <template slot="title">
               <i class="el-icon-platform-eleme"></i>
                <span>{{second.authName}}</span>
            </template>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <span class="system-title">电商后台管理系统</span>
          <div class="welcome">
            <span>欢迎你:admin</span>
            <a href="/login">退出</a>
          </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getAllmenus } from '@/api/right_index.js'
export default {
  data () {
    return {
      meusList: []
    }
  },
  mounted () {
    getAllmenus().then(result => {
      this.meusList = result.data.data
    })
  },
  methods: {
    handleOpen (key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath)
    }
  }
}
</script>

<style lang='less' scoped>
.home {
  height: 100%;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .logo {
    height: 120px;
    width: 200px;
    background: url(../assets/5.jpg);
    background-size: cover;
    background-color: #fff;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: lightblue;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292cf;
    }
  }
  .system-title {
    font-size: 28px;
    color: lightblue;
  }
  .welcome {
    color: lightcoral;
  }
}
</style>
