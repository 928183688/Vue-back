<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
      <el-table :data="rightList" border style="width:100%">
        <el-table-column type="index" :index="indexMethod"></el-table-column>
        <el-table-column prop="authName" label="权限" width="180"></el-table-column>
        <el-table-column prop="path" label="路径" width="180"></el-table-column>
        <el-table-column  label="层级" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.level | levelFormat}}</span>
          </template>
          </el-table-column>
      </el-table>
  </div>
</template>

<script>
import { getAllRightList } from '@/api/right_index.js'
export default {
  data () {
    return {
      rightList: []
    }
  },
  filters: {
    levelFormat (level) {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '2') {
        return '三级'
      }
    }
  },
  mounted () {
    this.getAllRight()
  },
  methods: {
    // 权限管理接口
    async getAllRight () {
      let result = await getAllRightList('list')
      this.rightList = result.data.data
    }
  }
}
</script>

<style lang='less' scoped>
</style>
