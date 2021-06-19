<template>
  <div id="app">
    <router-view></router-view>
    <button v-permission="'edit'" @click="toAbout">edit</button>
    <button v-permission="'add'" @click="toAbout">add</button>
    <button v-permission="'deleted'" @click="toAbout">deleted</button>
  </div>
</template>

<script>
// import Vue from 'vue';
export default {
  name: 'App',
  data(){
    return{
    }
  },
  methods:{
    toAbout(){
      this.$router.push('/about');
    }
  }
}
</script>

<style>
</style>
