<template>
  <div>
    <!-- 搜索框 -->
    <el-input
      placeholder="请输入内容"
      v-model="goods.query"
      class="input-with-select search"
      @keydown.enter.native="search"
      clearable
    >
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <!-- 添加商品按钮 -->
    <el-button type="success" @click="$router.push({name:'Add'})">添加商品</el-button>
    <!-- 表格 -->
    <el-table ref="singleTable" :data="goodsList" highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="goods_name" label="商品名称" width="500"></el-table-column>
      <el-table-column property="goods_weight" label="商品重量" width="120"></el-table-column>
      <el-table-column property="goods_price" label="商品价格"></el-table-column>
      <el-table-column property="goods_number" label="商品数量"></el-table-column>
      <el-table-column label="创建日期" width="200">
        <template slot-scope="scope" >
          <span>{{scope.row.add_time | timeFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
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
import { getAllGoodList } from '@/api/goods_index.js'
export default {
  data () {
    return {
      // 这是商品表格
      goodsList: [],
      // 这是全部商品参数
      goods: {
        query: '',
        pagenum: 1,
        pagesize: 10
      }
    }
  },
  mounted () {
    getAllGoodList(this.goods).then(result => {
      console.log(result)
      this.goodsList = result.data.data.goods
    })
  },
  // 时间过滤器
  filters: {
    timeFormat (times) {
      var time = new Date()
      var year = time.getFullYear()
      var month = time.getMonth() + 1
      var day = time.getDate()
      var hour = time.getHours()
      var minute = time.getMinutes()
      var second = time.getSeconds()
      var timers = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      return timers
    }
  }
}
</script>

<style lang='less' scoped>
.search {
  width: 300px;
  margin-right: 10px;
}
</style>
