<template lang="pug">
  section
</template>

<script>
import axios from 'axios'

export default {
  async mounted () {
    const { data: url } = await axios(`/login`)
    console.log(url)
    window.location.href = url
  }
}
</script>