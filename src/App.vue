<template>
	<div>
		<div class="text-container">monitor-sdk</div>
		<nav class="nav">
			<router-link to="home">Home</router-link>
		</nav>
		<!-- <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a> -->
		<div class="card">
			<router-view></router-view>
		</div>
	</div>
	<!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

<script lang="ts">
	import { defineComponent } from 'vue';
	import HelloWorld from './components/HelloWorld.vue';
	import { PerformanceMonitor } from './observe/performance/index';
import ActionMonitor from './observe/action/actionMonitor';

export default defineComponent({
		components: {
			HelloWorld,
		},
		setup() {
			let p = new PerformanceMonitor();
			p.start();
			let actionMonitor = new ActionMonitor()
			actionMonitor.start()
		},
	});
</script>

<style scoped>
	/* .logo {
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
} */
	/* 定义文字打字机效果展开的关键帧动画 */
	@keyframes typing {
		from {
			width: 0;
			opacity: 0;
		}
		to {
			width: 100%;
			opacity: 1;
		}
	}

	/* 定义文本容器样式 */
	.text-container {
		display: inline-block;
		overflow: hidden;
		font-size: 40px;
		font-weight: bold;
		color: #333;
		white-space: nowrap;
		animation: typing 2s steps(100, end) forwards;
	}
	.nav {
		font-size: 20px;
    font-weight: 800;
		margin-bottom: 10px;
	}
	.card {
		width: 80rem;
		height: 30rem;
		border-radius: 1.5rem;
		box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
	}
</style>
