<template>
	<div class="home">
		<div class="home-title">Test Buttons</div>
		<div class="home-btns">
			<div class="home-btn bgColor1" @click="codeErr">js错误</div>
			<div class="home-btn bgColor2" @click="asyncError">异步错误</div>
			<div class="home-btn bgColor3" @click="promiseErr">promise错误</div>
			<div class="home-btn bgColor4" @click="xhrError">xhr请求报错</div>
			<div class="home-btn bgColor5" @click="fetchError">fetch请求报错</div>
			<div class="home-btn bgColor2" @click="resourceError">加载资源报错</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	// import { ref } from 'vue';
	// let tableData = ref([]);
	const getTableData = function () {
		// setTimeout(() => {
		// 	fetch(`http://localhost:8083/getErrorList`)
		// 		.then((response) => response.json())
		// 		.then((res) => {
		// 			tableData = res.data;
		// 		});
		// }, 500);
	};
	const fetchError = function () {
		fetch('https://jsonplaceholder.typicode.com/posts/a', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=UTF-8',
			},
		})
			.then((res) => {
				if (res.status == 404) {
					getTableData();
				}
			})
			.catch(() => {
				getTableData();
			});
	};
	const asyncError = function () {
		getTableData();
		setTimeout(() => {
			let a: string | undefined = undefined;
			if (a!.length) {
				// 非空断言操作符告诉编译器忽略 undefined 类型上没有 length 属性的错误
				console.log('1');
			}
		});
	};
	const codeErr = function () {
		getTableData();
		let a: any = undefined;
		if (a.length) {
			console.log('1');
		}
	};
	const resourceError = function () {
		let script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = 'https://abc.com/index.js';
		document.body.appendChild(script);
		// 资源加载失败
		script.onerror = () => {
			getTableData();
		};
	};
	const promiseErr = function () {
		new Promise((resolve) => {
			getTableData();
			let person: any = {};
			person.name.age();
			resolve(() => {});
		});
	};

	const xhrError = function () {
		let ajax = new XMLHttpRequest();
		ajax.open('GET', 'https://abc.com/test/api');
		ajax.setRequestHeader('content-type', 'application/json');
		ajax.onreadystatechange = function () {
			if (ajax.readyState == 4) {
				getTableData();
			}
			if (ajax.status === 200 || ajax.status === 304) {
				console.log('ajax', ajax);
			}
		};
		ajax.send();
		ajax.addEventListener('loadend', () => {});
	};
</script>

<style scoped>
	.home {
		height: 100%;
		width: 100%;
	}
	.home-title {
		font-size: 24px;
		display: block;
		font-weight: 800;
		text-align: left;
		color: #646cff;
	}
	.home-btns {
		font-size: 20px;
		display: flex;
	}
	.home-btn {
		/* width: 120px; */
		min-width: 120px;
		padding: 0 10px;
		height: 44px;
		border-radius: 15px;
		line-height: 44px;
		margin-right: 10px;
		cursor: pointer;
	}
	.home-btn:hover {
		opacity: 0.8;
	}
	.bgColor1 {
		color: white;
		background-color: #409eff;
	}
	.bgColor2 {
		color: white;
		background-color: #67c23a;
	}
	.bgColor3 {
		color: white;
		background-color: #909399;
	}
	.bgColor4 {
		color: white;
		background-color: #e6a23c;
	}
	.bgColor5 {
		color: white;
		background-color: #f56c6c;
	}
</style>
