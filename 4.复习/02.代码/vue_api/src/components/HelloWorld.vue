<template>
  <div class="hello">
    <h1 v-for="item in a" @click="change(item)">{{ item }}</h1>
    <!-- <h2>{{inject}}</h2> -->
    <input type="text" :value="value" @input="handleInput">
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: [
    "msg",
    "change",
    "num",
    "value"
  ],
  data(){
    return  {
      a:[1,2,3]
    }
  },
  inject:["ccc"],
  $num:3,
  methods:{
    changeNum(){
      // this.a[1] = 4;
      this.a.length = 2;
      console.log(this.a)
    },
    handleInput(event){
      // this.value=event.target.value;
      this.$emit('input6666666',event.target.value)
    }
  },
  model:{
    event:'input6666666',
    prop:'num'
  },
  mounted(){
    // console.log(this.ccc)
    console.log('num',this.num)
    // console.log('$num',this.$options.$num)
    // console.log(c)
    // 更新DOM的操作在微任务中,更新的函数会放在nextTick里执行
    // this.$delete(this.$data,'a')
    
    // Promise.resolve().then(()=>{
    //   console.log('promise')
    // })
    // this.$nextTick(()=>{
    //   console.log('nextTick1')
    // })
    // this.$nextTick(()=>{
    //   console.log('nextTick2')
    // })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
