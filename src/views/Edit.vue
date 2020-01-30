<template>
  <div>
    <Form mode="edit" :formData="formData" :id="id" />
  </div>
</template>

<script>
import axios from 'axios'
import Form from '@/components/Form.vue'

export default {
  name: 'edit',
  data() {
    return {
      formData: {},
      id: '',
    }
  },
  components: {
    Form,
  },
  mounted() {
    this.id = this.$route.params.id
    axios
      .get(`/api/blog/detail?id=${this.id}`)
      .then(res => {
        const data = res.data.data
        this.formData = data
      })
      .catch(function(error) {
        console.log(error)
      })
  },
}
</script>
