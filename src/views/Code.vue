<template lang="pug">
  section
</template>

<script>
import axios from 'axios'

export default {
  async mounted () {
    // ?code=aw35aesdtadsf
    const { code } = this.$route.query
    const { data: response } = await axios(`/code/${code}`)
    console.log(response)
  }
}
</script>