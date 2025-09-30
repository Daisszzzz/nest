
import axios from 'axios'
import type {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { ResultEnum } from '@/enums/httpEnums'
import { ResultData } from './type'
import { LOGIN_URL } from '@/config/config'
import { RESEETSTORE } from '../reset'
import router from '@/router'

export const service: AxiosInstance = axios.create({
  // Set different baseURL according to environment
  baseURL: import.meta.env.PROD ? import.meta.env.VITE_APP_BASE_URL : '/',
  timeout: ResultEnum.TIMEOUT as number,
})
/**
 * @description: Request interceptor
 * @returns {*}
 */
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    const token = userStore.token
    if (token) {
      config.headers['access-token'] = token
    }
    return config
  },
  (error: AxiosError) => {
    ElMessage.error(error.message)
    return Promise.reject(error)
  },
)
/**
 * @description: Response interceptor
 * @returns {*}
 */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response
    // * Login expired
    if (ResultEnum.EXPIRE.includes(data.code)) {
      RESEETSTORE()
      ElMessage.error(data.message || ResultEnum.ERRMESSAGE)
      router.replace(LOGIN_URL)
      return Promise.reject(data)
    }

    if (data.code && data.code !== ResultEnum.SUCCESS) {
      ElMessage.error(data.message || ResultEnum.ERRMESSAGE)
      return Promise.reject(data)
    }
    return data
  },
  (error: AxiosError) => {
    // Handle HTTP network errors
    let message = ''
    // HTTP status code
    const status = error.response?.status
    switch (status) {
      case 401:
        message = 'Token expired, please login again'
        break
      case 403:
        message = 'Access denied'
        break
      case 404:
        message = 'Request address error'
        break
      case 500:
        message = 'Server error'
        break
      default:
        message = 'Network connection error'
    }

    ElMessage.error(message)
    return Promise.reject(error)
  },
)

/**
 * @description: Export encapsulated request methods
 * @returns {*}
 */
const http = {
  get<T>(
    url: string,
    params?: object,
    config?: AxiosRequestConfig,
  ): Promise<ResultData<T>> {
    return service.get(url, { params, ...config })
  },

  post<T>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
  ): Promise<ResultData<T>> {
    return service.post(url, data, config)
  },

  put<T>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
  ): Promise<ResultData<T>> {
    return service.put(url, data, config)
  },

  delete<T>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
  ): Promise<ResultData<T>> {
    return service.delete(url, { data, ...config })
  },
}

export default http
