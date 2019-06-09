<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加分类按钮 -->
    <el-button type="success" @click="addDialogFormVisible = true">添加分类</el-button>
    <!-- 添加分类弹出框 -->
    <el-dialog title="分类列表" :visible.sync="addDialogFormVisible">
      <el-form :model="addform">
        <el-form-item label="分类名称">
          <el-input v-model="addform.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader v-model="addform.cat_pid" :options="options" @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table :data="cateList" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-tree :data="scope.row.children" :props="defaultProps"></el-tree>
        </template>
      </el-table-column>
      <el-table-column label="分类名称" prop="cat_name"></el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">
          <span>{{scope.row.cat_deleted}}</span>
        </template>
      </el-table-column>

      <el-table-column label="排序" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <!-- 这边是操作按钮 -->
        <template slot-scope>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="success" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="danger" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAllcategories } from '@/api/categories_index.js'
export default {
  data () {
    return {
      // 添加分类
      addDialogFormVisible: false,
      addform: {
        cat_name: '',
        cat_pid: ''
      },
      // 表格数据
      cateList: [],
      defaultProps: {
        children: 'children',
        label: 'cat_name'
      }
    }
  },
  mounted () {
    getAllcategories(1, 2, 3).then(result => {
      console.log(result)
      this.cateList = result.data.data
    })
  },
  methods: {
    handleChange (value) {
      console.log(value)
    }
  }
}
</script>

<style lang='less' scoped>
</style>
