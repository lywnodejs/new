<script setup>
import {watchEffect,watch,ref,toRef,reactive,toRefs, computed} from 'vue'
import { useStore } from '@/store/index'
import { storeToRefs } from 'pinia'
defineProps({
  msg: {
    type: String,
    required: true
  }
})
const $eimt = defineEmits(['sendTest']);



const test = ref(0); // 创建响应式数据
// console.log(test);// test.value = 0

const test1 = reactive({ // 创建响应式对象
  foo: 1,
  bar: 2
})
const test1Ref = toRef(test1, 'foo') // 创建响应式对象某个属性的ref ，保持同源 $宏命令需要设置viteconfig.js
const test1Ref2 = toRefs(test1);
// test1Ref++
console.log(test1Ref);
console.log(test1);
console.log(test1Ref2.foo.value);
console.log('--------------');


const store = useStore();
const { count } = storeToRefs(store);


function sendData(){
  $eimt('sendTest',322222)
  // store.$patch({
  //   count:3
  // })
  // store.count = 'test2'
  store.setCount('test2');
  // test++;
  console.log(count);
}



</script>

<template>
  <div class="greetings">
    {{count}}
    {{test}}
    <h1 class="green" @click="sendData()">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
