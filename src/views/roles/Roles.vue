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
    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible">
      <el-form :model="addform" :rules="rules" ref="addform" style="width:400px">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="addform.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
          <el-input
            v-model="addform.roleDesc"
            autocomplete="off"
            @keydown.enter.native="addRoleName"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleName">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑提交框 -->
    <el-dialog title="收货地址" :visible.sync="editDialogFormVisible">
      <el-form :model="editform" :rules="rules" ref="editform" style="width:400px">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="editform.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
          <el-input
            v-model="editform.roleDesc"
            autocomplete="off"
            @keydown.enter.native="editRoleName"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleNameList">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色列表弹出框 -->
    <el-dialog title="角色列表" :visible.sync="authorDialogTableVisible">
      <el-tree
        ref="rightTree"
        :data="authorList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys ="selectedKeys"
        :props="defaultProps"
        style="height:300px;overflow:auto"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authorDialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantSubmit">确 定</el-button>
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
                  @close="removeRoleName(scope.row,first.id)"
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
                        @close="removeRoleName(scope.row,second.id)"
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
                        @close="removeRoleName(scope.row,third.id)"
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
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="success" icon="el-icon-edit" @click="editRoleName(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="danger" icon="el-icon-delete" @click="deleteRoleName(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="授权角色" placement="top-start">
            <el-button type="warning" icon="el-icon-check" @click="authorRoleName(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getRoleName } from '@/api/index.js'
import { getAllRightList } from '@/api/right_index.js'
import {
  deleteRoleName,
  addRoleNameList,
  deleteRoleNameById,
  editRoleNameList,
  grantRoleName
} from '@/api/roles_index.js'
export default {
  data () {
    return {
      // 授权角色
      authorDialogTableVisible: false,
      // 放入第三权限得id
      selectedKeys: [],
      // 角色 ID
      roleId: [],
      authorList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 编辑角色
      editDialogFormVisible: false,
      editform: {
        id: '',
        roleName: '',
        roleDesc: ''
      },

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
    // 拿到权限列表
    async authorRoleName (row) {
      let result = await getAllRightList('tree')
      this.authorList = result.data.data
      this.authorDialogTableVisible = true
      // 存一个ID
      this.roleId = row.id
      // 把之前得数组清空
      this.selectedKeys = []
      // 第一权限
      row.children.forEach(first => {
        // 第二权限
        first.children.forEach(second => {
          // 第三权限
          second.children.forEach(third => {
            // 把第三权限得id放进新数组里
            this.selectedKeys.push(third.id)
          })
        })
      })
    },
    // 授权角色
    async grantSubmit () {
      var allNodes = this.$refs.rightTree.getCheckedNodes()
      var arr = allNodes.map(value => {
        // 返回得格式不对
        return value.id + ',' + value.pid
      })
      // 要把arr数组 转为字符串 在转换为数组
      var ids = arr.join(',').split(',')
      // 在为数组去重 然后这个时候是个对象 用Array.from在转换为数组
      var lastId = Array.from(new Set(ids))
      let result = await grantRoleName(this.roleId, lastId.join(','))
      if (result.data.meta.status) {
        this.$message({
          type: 'success',
          message: result.data.meta.msg
        })
        this.authorDialogTableVisible = false
        this.getAllRoleName()
      }
    },
    // 拿到角色列表数据
    async getAllRoleName () {
      let result = await getRoleName()
      this.roleList = result.data
    },
    // 删除权限
    async removeRoleName (row, rightId) {
      let result = await deleteRoleName(row.id, rightId)
      // row.children 和 result.data.data  就是第一权限 刷新一遍
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
    },
    // 删除角色
    async deleteRoleName (id) {
      let result = await deleteRoleNameById(id)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: result.data.meta.msg
        })
        this.getAllRoleName()
      })
    },
    // 编辑角色
    editRoleName (row) {
      this.editDialogFormVisible = true
      this.editform.id = row.id
      this.editform.roleName = row.roleName
      this.editform.roleDesc = row.roleDesc
    },
    // 编辑提交
    async editRoleNameList () {
      let result = await editRoleNameList(this.editform.id, this.editform)
      this.$refs.editform.validate(valid => {
        if (valid) {
          this.editDialogFormVisible = false
          this.getAllRoleName()
          this.$message({
            type: 'success',
            message: result.data.meta.msg
          })
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
