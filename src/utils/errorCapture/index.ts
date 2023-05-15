import { VueInstance, ViewModel, ErrorTarget, HttpData } from './types';
import ErrorStackParser from 'error-stack-parser';
import { EVENTTYPES, STATUS_CODE } from './constants';
import {
	getTimestamp,
	resourceTransform,
	unknownToString,
	httpTransform,
} from './utils';
function install(Vue: VueInstance) {
	Vue.config.errorHandler = function (
		err: Error,
		vm: ViewModel,
		info: string
	): void {
		console.log('Vue.config.errorHandler', err);
		// 进行同步错误处理
		handleError(err);
	};
	window.addEventListener('unhandledrejection', function (e) {
		console.log('unhandledrejection', e);
		handleUnhandleRejection(e);
	});
	// 收集异步、资源加载错误
	window.addEventListener(
		'error',
		(e) => {
			const tag = (e.target as HTMLElement).localName;
			console.log('error', e);
			// 定位资源加载错误类型
			if (tag === 'link' || tag === 'script') {
				// 进行资源加载错误处理
				handleError(e as ErrorTarget);
			} else {
				// 进行异步错误处理
				handleError(e as ErrorTarget);
			}
			// 注意这里必须在捕获阶段才能监听到
		},
		true
	);
}
function handleError(e: ErrorTarget) {
	// console.log('e',e)
	// console.log('e.target',e.target)
	// console.log('e.target?.localName',e.target?.localName)
	if (!e.target || (e.target && !e.target.localName)) {
		// console.log('inTarget')
		const stackFrame = ErrorStackParser.parse(
			e.target ? (e.error as Error) : (e as Error)
		)[0];
		// console.log('stackFrame',stackFrame)
		const { fileName, columnNumber, lineNumber } = stackFrame;
		const errorData = {
			type: EVENTTYPES.ERROR,
			status: STATUS_CODE.ERROR,
			time: getTimestamp,
			message: e.message,
			fileName,
			line: lineNumber,
			column: columnNumber,
		};
		console.log(errorData, 'errorData');
	}
	if (e.target?.localName) {
		// 进入资源加载错误处理
		const data = resourceTransform(e.target);
		const errorData = {
			type: EVENTTYPES.RESOURCE,
			status: STATUS_CODE.ERROR,
			time: getTimestamp(),
			data,
		};
		console.log('资源加载错误', errorData);
	}
}
function handleUnhandleRejection(e: PromiseRejectionEvent) {
	const stackFrame = ErrorStackParser.parse(e.reason)[0];
	const { fileName, columnNumber, lineNumber } = stackFrame;
	const message = unknownToString(e.reason.message || e.reason.stack);
	const errorData = {
		type: EVENTTYPES.UNHANDLEDREJECTION,
		status: STATUS_CODE.ERROR,
		time: getTimestamp(),
		message,
		fileName,
		line: lineNumber,
		column: columnNumber,
	};
	console.log('promise错误', errorData);
}
// 处理xhr、fetch回调 记得重写xhr和fetch
function handleHttp(data: HttpData, type: EVENTTYPES): void {
	const result = httpTransform(data);
	let errorData = {};
	// 添加用户行为，去掉自身上报的接口行为
	// if (!data.url.includes(options.dsn)) {
	errorData = {
		type,
		data: result,
		status: result.status,
		time: data.time,
	};
	// }

	if (result.status === 'error') {
		console.log('xhr,fetch,errorData', errorData);
		// 上报接口错误
		// transportData.send({ ...result, type, status: STATUS_CODE.ERROR });
	}
}
export default {
	install,
};
