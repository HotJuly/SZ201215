<template>
  <div id="app" class="A">
    <!-- <keep-alive exclude="HelloWorld"> -->
      <!-- <component :is="component" :msg.sync="num" :change="change" v-model="num"></component> -->
      <HelloWorld v-if="flag" ref="HelloWorld" :msg.sync="num" :change="change" v-model="num">
        <template>
          <h1>我是默认插槽</h1>
        </template>
        <template v-slot:header>
          <h1>我是header插槽</h1>
        </template>
        <template v-slot:footer="slotScoped">
          <h1>我是{{slotScoped.slotName}}插槽</h1>
        </template>
      </HelloWorld>
    <!-- </keep-alive> -->
    <!-- <HelloWorld ref="HelloWorld" :msg.sync="num" :change="change" v-model="num"/> -->
    <!-- <HelloWorld ref="HelloWorld" :msg="num" @update:msg="value => num = value"/> -->


    <h1 ref="h1">ref</h1>
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
      num:7,
      component:HelloWorld,
      flag:true
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
  mounted(){
    // console.log('children',this.$children)
    console.log('h1',this.$refs.h1)
    console.log('HelloWorld',this.$refs.HelloWorld)
  },
  $num:2,
  watch:{

  }
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
