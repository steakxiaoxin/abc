<template>
  <div>
    <el-button>新增</el-button>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column prop="id" label="id" />
      <el-table-column prop="author" label="作者" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="createtime" label="时间" />
      <el-table-column prop="content" label="内容" />
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'list',
  created() {
    this.fetchData()
  },
  data() {
    return {
      tableData: [],
    }
  },
  methods: {
    fetchData() {
      const _this = this
      axios
        .get('/api/blog/list')
        .then(function(res) {
          const data = res.data.data
          _this.tableData = data
          console.log('data: ', data)
        })
        .catch(function(error) {
          console.log(error)
        })
    },
  },
}
</script>
