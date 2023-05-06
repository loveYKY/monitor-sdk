<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
import { PerformanceMonitor } from "./observe/performance/index";

export default defineComponent({
  components: {
    HelloWorld,
  },
  setup() {
    let p = new PerformanceMonitor();
    p.start();
    console.log(p);

    // let observer = new window.MutationObserver((mutationList) => {
    //   console.log(mutationList);
    // });
    // observer.observe(document, {
    //   childList: true, // 监听添加或删除子节点
    //   subtree: true, // 监听整个子树
    //   characterData: true, // 监听元素的文本是否变化
    //   attributes: true, // 监听元素的属性是否变化
    // });
  },
});
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
