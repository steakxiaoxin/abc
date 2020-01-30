<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="form">
    <el-form-item label="作者" prop="author">
      <el-input v-model="ruleForm.author" :disabled="mode == 'edit'"></el-input>
    </el-form-item>
    <el-form-item label="标题" prop="title">
      <el-input v-model="ruleForm.title"></el-input>
    </el-form-item>
    <el-form-item label="内容" prop="content">
      <el-input type="textarea" v-model="ruleForm.content"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button v-if="mode == 'add'" type="primary" @click="submitForm('ruleForm')">新建</el-button>
      <el-button v-else type="primary" @click="submitForm('ruleForm')">保存</el-button>
      <el-button @click="handleBack">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Form',
  props: {
    mode: String,
    formData: Object,
    id: String,
  },
  watch: {
    formData(newValue, oldValue) {
      if (this.mode == 'edit') {
        const { author, title, content } = newValue
        this.ruleForm.author = author
        this.ruleForm.title = title
        this.ruleForm.content = content
      }
    },
  },
  data() {
    return {
      ruleForm: {
        author: '',
        title: '',
        content: '',
      },
      rules: {
        author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
      },
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            title: this.ruleForm.title,
            author: this.ruleForm.author,
            content: this.ruleForm.content,
          }
          let api = this.mode == 'add' ? 'new' : `update?id=${this.id}`
          axios.post(`/api/blog/${api}`, params).then(res => {
            if (res.data.errno == 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                onClose: () => {
                  this.$router.push('/list')
                },
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleBack() {
      this.$router.push('/list')
    },
  },
}
</script>

<style scoped>
.form {
  width: 50%;
}
</style>
