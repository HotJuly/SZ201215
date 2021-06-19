<template>
  <div id="app" class="A">
      <ul>
        <li v-for="(item,index) in arr" :key="item">
          <label>{{item}}:</label><input type="text">
        </li>
      </ul>
      <button @click="insert">插入</button>
  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return{
      arr:[1,2,3,4,5]
    }
  },
  methods:{
    insert(){
      this.arr.splice(2,0,6)
    }
  }
}
</script>

<style>
</style>
