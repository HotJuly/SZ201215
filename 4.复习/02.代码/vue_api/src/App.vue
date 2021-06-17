<template>
  <div id="app" class="A">
    <HelloWorld msg="haha" :change="change" v-model="num"/>
    <!-- <HelloWorld msg="haha" :change="change" :value="num" @input=" value => num = value"/> -->
    {{num}}
    <!-- <input type="text" v-model="num"> -->
    <!-- <input type="text" :value="num" @input=" event => num = event.target.value"> -->
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  // name: 'App',
  components: {
    HelloWorld
  },
  data(){
    return{
      num:7
    }
  },
  provide:{
    // ccc:Vue.observable({
    //   a:1
    // })
    ccc:"xixi"
  },
  methods:{
    change(value){
      this.num = value;
    }
  },
  $num:2
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
