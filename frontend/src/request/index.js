import axios from 'axios'
import {
	ElMessage
} from 'element-plus'

// 记录和显示错误
function errorLog(err) {
	// 打印到控制台
	// 显示提示
	ElMessage({
		message: err.message,
		type: 'error',
		duration: 5 * 1000
	})
}

// 创建一个 axios 实例
const service = axios.create({
	timeout: 10000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
	config => {
		return config
	},
	error => {
		// 发送失败
		Promise.reject(error)
	}
)

// 响应拦截器
service.interceptors.response.use(
	response => {
		const res = response.data
		if (response.status !== 200) {
			ElMessage({
				message: res.message,
				type: 'error',
				duration: 3 * 1000
			})
			return Promise.reject(res.message)
		} else if (res && res.code !== 200) {
			// 显示提示
			ElMessage({
				message: res.message,
				type: 'error',
				duration: 5 * 1000
			})
			return Promise.reject(res.message)
		} else {
			return res.data
		}
	},
	error => {
		ElMessage({
			message: '网络异常',
			type: 'error',
			duration: 5 * 1000
		})
		// errorLog(new Error(` ${error.response.data.message} !: ${error.config.url}`))
		return Promise.reject(error)
	}
)

export default service
