const Koa = require('koa');
const path = require('path');
const fs = require('fs');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');

const coBody = require('co-body');

const app = new Koa();
let router = new Router();

app.use(
	bodyParser({
		jsonLimit: '100mb',
		formLimit: '100mb',
		textLimit: '100mb',
	})
);

app.use(async (ctx, next) => {
	ctx.set('Access-Control-Allow-Origin', '*'); //允许所有域名跨域
	ctx.set('Access-Control-Allow-Headers', 'Content-Type'); //允许接收的请求头类型
	ctx.set('Access-Control-Allow-Methods', '*'); //允许的请求方法类型
	ctx.set('Content-Type', 'application/json;charset=utf-8'); //表示接收和返回的数据类型为 JSON 格式
	await next();
});

// 存储性能数据
let performanceList = [];
// 存储错误数据
let errorList = [];
// 存储录屏数据
let recordScreenList = [];
// 存储白屏检测数据
let whiteScreenList = [];

router.get('/hello', async (ctx, next) => {
	console.log('/hello');
	ctx.body = 'Hello World';
});

// 获取js.map源码文件
router.get('/getmap', async (ctx, next) => {
	console.log('/getmap');
	console.log('ctx.query.env', ctx.query.env);

	let fileName = ctx.query.fileName;
	if (ctx.query.env == 'development') {
		let mapFile = path.join(__filename, '..', fileName);
		console.log('mapFile', mapFile);
		let data = await fs.promises.readFile(mapFile);
		ctx.body = data;
	} else {
		// ctx.query 获取接口参数
		let mapFile = path.join(__filename, '..', 'dist/js');
		// 拿到dist目录下对应map文件的路径
		let mapPath = path.join(mapFile, `${fileName}.map`);
		let data = await fs.promises.readFile(mapPath);
		ctx.body = data;
	}
});

router.get('/getErrorList', async (ctx, next) => {
	console.log('/getErrorList');
	ctx.body = {
		code: 200,
		data: errorList,
	};
});

router.get('/getRecordScreenId', async (ctx, next) => {
	console.log('/getRecordScreenId');
	let id = ctx.query.id;
	let data = recordScreenList.filter((item) => item.recordScreenId == id);
	ctx.body = {
		code: 200,
		data,
	};
});

router.post('/reportData', async (ctx, next) => {
	console.log('/reportData');
	try {
		// ctx.request.body 不为空时为正常请求，如录屏信息
		let length = Object.keys(ctx.request.body).length;
		if (length) {
			recordScreenList.push(ctx.request.body);
		} else {
			// 使用 web beacon 上报数据
			let data = await coBody.json(ctx.req);
			if (!data) return;
			if (data.type == 'performance') {
				performanceList.push(data);
			} else if (data.type == 'recordScreen') {
				recordScreenList.push(data);
			} else if (data.type == 'whiteScreen') {
				whiteScreenList.push(data);
			} else {
				errorList.push(data);
			}
		}
		ctx.body = {
			code: 200,
			message: '上报成功！',
		};
	} catch (err) {
		ctx.body = {
			code: 203,
			message: '上报失败！',
			err,
		};
	}
});

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

app.listen(5174, () => {
	console.log('Server is running at http://localhost:5174');
});
