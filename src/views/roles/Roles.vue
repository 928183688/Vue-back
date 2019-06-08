<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加用户按钮 -->
    <el-button type="success" @click="addDialogFormVisible = true">添加角色</el-button>
    <!-- 添加用户弹出框 -->
    <el-dialog title="收货地址" :visible.sync="addDialogFormVisible">
      <el-form :model="addform" :rules="rules" ref="addform" style="width:400px">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="addform.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
          <el-input v-model="addform.roleDesc" autocomplete="off" @keydown.enter.native="addRoleName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleName">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table :data="roleList" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 这是第一权限 -->
          <el-row v-for="first in scope.row.children" :key="first.id" style="margin-top:15px">
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <el-tag
                  closable
                  :type="'success'"
                  @close="removeFirstRoleName(scope.row,first.id)"
                >{{first.authName}}</el-tag>
              </div>
            </el-col>
            <el-col :span="20">
              <div class="grid-content bg-purple-light">
                <!-- 这是第二权限 -->
                <el-row
                  v-for="second in first.children"
                  :key="second.id"
                  style="margin-bottom:15px"
                >
                  <el-col :span="6">
                    <div class="grid-content bg-purple">
                      <el-tag
                        closable
                        :type="'info'"
                        @close="removeSecondRoleName(scope.row,second.id)"
                      >{{second.authName}}</el-tag>
                    </div>
                  </el-col>
                  <!-- 这是第三权限 -->
                  <el-col :span="18">
                    <div class="grid-content bg-purple-light">
                      <el-tag
                        closable
                        :type="'warning'"
                        v-for="third in second.children"
                        :key="third.id"
                        style="margin-right:15px;margin-bottom:15px"
                        @close="removeThirdRoleName(scope.row,third.id)"
                      >{{third.authName}}</el-tag>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">没有任何的权限，请先分配</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <!-- 这边是操作按钮 -->
        <template slot-scope="">
          社会社会
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="success" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="danger" icon="el-icon-delete"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="授权角色" placement="top-start">
            <el-button type="warning" icon="el-icon-check"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getRoleName } from '@/api/index.js'
import { deleteRoleName, addRoleNameList } from '@/api/roles_index.js'
export default {
  data () {
    return {
      // 添加角色
      formLabelWidth: '',
      addDialogFormVisible: false,
      addform: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入描述名称', trigger: 'blur' }
        ]
      },
      // 角色列表
      roleList: []
    }
  },
  mounted () {
    // 调用
    this.getAllRoleName()
  },
  methods: {
    // 拿到角色列表数据
    async getAllRoleName () {
      let result = await getRoleName()
      this.roleList = result.data
    },
    // 删除第三权限
    async removeThirdRoleName (row, rightId) {
      let result = await deleteRoleName(row.id, rightId)
      // row.children 和 result.data.data  就是第一权限 刷新一遍
      this.$message({
        type: 'success',
        message: result.data.meta.msg
      })
      row.children = result.data.data
    },
    // 删除第二权限
    async removeSecondRoleName (row, rightId) {
      let result = await deleteRoleName(row.id, rightId)
      this.$message({
        type: 'success',
        message: result.data.meta.msg
      })
      row.children = result.data.data
    },
    // 删除第一权限
    async removeFirstRoleName (row, rightId) {
      let result = await deleteRoleName(row.id, rightId)
      this.$message({
        type: 'success',
        message: result.data.meta.msg
      })
      row.children = result.data.data
    },
    // 添加角色
    async addRoleName () {
      let result = await addRoleNameList(this.addform)
      // 验证表单
      this.$refs.addform.validate(valid => {
        // 如果通过
        if (valid) {
          // 就显示通过信息并且刷新并且重置表单
          this.$message({
            type: 'success',
            message: result.data.meta.msg
          })
          this.addDialogFormVisible = false
          this.getAllRoleName()
          this.$refs.addform.resetFields()
          // 没通过不给过
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
</style>
