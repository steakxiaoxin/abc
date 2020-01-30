<template>
  <div>
    <router-link to="/add"><el-button>新增</el-button></router-link>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column prop="id" label="id" />
      <el-table-column prop="author" label="作者" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="createtime" label="时间">
        <template slot-scope="scope">
          <span>{{ dayjs(scope.row.createtime).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容" />
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleToEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
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
    handleDelete(row) {
      const params = { author: row.author }
      axios.post(`/api/blog/delete?id=${row.id}`, params).then(res => {
        if (res.data.errno == 0) {
          this.$message({
            message: '删除成功',
            type: 'success',
          })
          this.fetchData()
        }
      })
    },
    handleToEdit(row) {
      this.$router.push(`/edit/${row.id}`)
    },
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
