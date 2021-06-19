<template>
  <div id="app">
    <router-view></router-view>
    <button @click="toAbout">About</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods:{
    toAbout(){
      this.$router.push('/about');
    }
  }
}
</script>

<style>
</style>
