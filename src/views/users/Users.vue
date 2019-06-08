<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <el-input
      placeholder="请输入内容"
      v-model="query"
      class="input-with-select search"
      @keydown.enter.native="search"
      clearable
    >
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <!-- 添加 -->
    <el-button type="success" style="margin-left:10px" @click="addDialogFormVisible = true">注册用户</el-button>
    <!-- 添加弹出框 -->
    <el-dialog title="注册用户" :visible.sync="addDialogFormVisible">
      <el-form
        :model="addForm"
        :rules="addrules"
        ref="addForm"
        label-width="100px"
        class="demo-ruleForm"
        style="width:300px"
      >
        <el-form-item label="用户" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="addDialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="addUserForm">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 数据表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column fixed="right" label="状态" width="300">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(scope.row.id,$event)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="300">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="success" icon="el-icon-edit" @click="edit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="danger" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
          </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start">
            <el-button type="warning"  icon="el-icon-check"  @click="roleName(scope.row)" ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑框 -->
    <el-dialog title="用户列表" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :rules="rules" ref="editForm" style="width:300px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input
            v-model="editForm.mobile"
            autocomplete="off"
            @keydown.enter.native="editUserList"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserList">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配列表编辑框 -->
    <el-dialog title="分配角色" :visible.sync="roleDialogFormVisible">
      <el-form :model="roleForm">
        <el-form-item label="用户名">
          <el-input v-model="roleForm.username" autocomplete="off" style="width:207px" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="roleForm.rid" placeholder="请选择">
            <el-option
              v-for="item in roleData"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRoleName">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2,4,6,8,10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import {
  getUserList,
  editUserListById,
  delUserListById,
  changeStateById,
  getRoleName,
  addUserList,
  grantRole
} from '@/api/index.js'
export default {
  data () {
    return {
      // 添加弹出框
      addDialogFormVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/,
            message: '输入得账号不合法',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z]\w{5,17}$/,
            message: '输入得密码不合法',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
            message: '输入得邮箱不合法',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
            message: '输入得手机不合法',
            trigger: 'blur'
          }
        ]
      },
      // 分配列表编辑框
      roleForm: {
        id: '',
        username: '',
        rid: ''
      },
      // 分配列表数组
      roleData: [],
      roleDialogFormVisible: false,
      value: '',
      // 编辑框数据
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }]
      },
      // 编辑框显示
      editDialogFormVisible: false,
      // 表格数据
      tableData: [],
      query: '',
      pagenum: 1,
      pagesize: 4,
      total: 0
    }
  },
  methods: {
    // 编辑
    edit (obj) {
      this.editDialogFormVisible = true
      this.editForm.id = obj.id
      this.editForm.username = obj.username
      this.editForm.email = obj.email
      this.editForm.mobile = obj.mobile
    },
    // 请求接口 实现编辑
    editUserList () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          editUserListById(
            // 直接传入整个对象
            this.editForm
          ).then(result => {
            // console.log(result)
            this.init()
            this.editDialogFormVisible = false
          })
        } else {
          this.$message({
            type: 'warning',
            message: '编辑失败'
          })
        }
      })
    },
    // 删除
    del (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delUserListById(id).then(result => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.init()
          })
        })
        .catch(result => {
          this.$message('不要乱删！')
        })
    },
    // 修改状态
    changeState (id, type) {
      changeStateById(id, type).then(result => {
        this.$message({
          type: 'success',
          message: '更改状态成功'
        })
      })
    },
    // 分配角色
    roleName (row) {
      this.roleDialogFormVisible = true
      this.roleForm.id = row.id
      this.roleForm.rid = row.rid
      this.roleForm.username = row.username
    },
    grantRoleName () {
      grantRole(this.roleForm.id, this.roleForm.rid)
        .then(result => {
          if (result.meta.status === 200) {
            this.$message({
              type: 'success',
              message: result.meta.msg
            })
            // 刷新
            this.init()
            this.roleDialogFormVisible = false
          }
        })
    },
    // 添加
    addUserForm () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addUserList(this.addForm).then(result => {
            this.addDialogFormVisible = false
            this.init()
            this.$refs.addForm.resetFields()
          })
        } else {
          this.$message({
            type: 'warning',
            message: '添加失败'
          })
        }
      })
    },
    // 搜索
    search () {
      // 刷新
      this.init()
    },
    // 选择每页多少项
    handleSizeChange (val) {
      this.pagesize = val
      // console.log(`每页 ${val} 条`)
      // 刷新
      this.init()
    },
    // 每页选择器
    handleCurrentChange (val) {
      this.pagenum = val
      // console.log(`当前页: ${val}`)
      // 刷新
      this.init()
    },
    // 封装获取数据列表
    init () {
      getUserList({
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }).then(result => {
        console.log(result)
        this.tableData = result.data.users
        this.total = result.data.total
      })
    }
  },
  mounted () {
    this.init()
    // 获取角色列表
    getRoleName().then(result => {
      this.roleData = result.data
    })
  }
}
</script>

<style lang='less' scoped>
.input-with-select {
  width: 300px;
}
</style>
