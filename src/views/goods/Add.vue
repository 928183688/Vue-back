<template>
  <div class="add">
    <!-- 步骤条 -->
    <el-steps :active="activeName-0" finish-status="success">
      <el-step title="商品信息"></el-step>
      <el-step title="上传图片"></el-step>
      <el-step title="商品描述"></el-step>
      <el-step title="商品参数"></el-step>
    </el-steps>
    <!-- 标签页 -->
    <el-form
      :model="addForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-tabs v-model="activeName" :tab-position="'left'">
        <el-tab-pane label="商品信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <!-- 级联选择器 -->
          <el-form-item label="商品类型">
            <el-cascader :options="cateList" :props="cateProps" clearable @change="getcateList"></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="1">
          <el-upload
            class="upload-demo"
            action="http://localhost:8888/api/private/v1/upload"
            :headers="setToken()"
            :on-success="uploadSuccess"
            :file-list="fileList"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品描述" name="2">
          <quill-editor v-model="addForm.goods_introduce" style="height:150px"></quill-editor>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="3">定时任务补偿</el-tab-pane>
      </el-tabs>
      <!-- 添加商品按钮 -->
      <el-button type="success" @click="addGoods">添加</el-button>
    </el-form>
  </div>
</template>

<script>
import { getAllcategories } from '@/api/categories_index.js'
import { addGoodList } from '@/api/goods_index.js'
export default {
  data () {
    return {
      // 上传图片得数组
      fileList: [],
      // 级联分类数据
      cateList: [],
      cateProps: {
        children: 'children',
        label: 'cat_name',
        value: 'cat_id'
      },
      // 表单数据
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        goods_cat: '',
        pics: [],
        attrs: []
      },
      // 表单验证
      rules: {
        goods_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入重量', trigger: 'blur' }
        ]
      },
      // 步骤条
      activeName: 0
    }
  },
  mounted () {
    getAllcategories(3).then(result => {
      this.cateList = result.data.data
    })
  },
  methods: {
    // 添加商品
    async addGoods () {
      let result = await addGoodList(this.addForm)
      if (result.data.meta.status === 201) {
        this.$message({
          type: 'success',
          message: result.data.meta.msg
        })
        setTimeout(() => {
          this.$router.push({ name: 'List' })
        }, 1500)
      } else {
        this.$message({
          type: 'warning',
          message: result.data.meta.msg
        })
      }
    },
    // 上传文件添加token验证
    setToken () {
      return { Authorization: localStorage.getItem('Login_token') }
    },
    // 上传文件成功 把图片路径加存起来
    uploadSuccess (response) {
      this.addForm.pics.push({ pic: response.data.tmp_path })
    },
    // 级联选中得id
    getcateList (value) {
      this.addForm.goods_cat = value.join(',')
    }
  }
}
</script>

<style lang='less' scoped>
</style>
