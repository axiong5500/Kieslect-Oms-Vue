import axios from 'axios'
import { setupInterceptors } from './interceptors'

export function createAxios(options = {}) {
  const defaultOptions = {
    baseURL: '/api',
    timeout: 30000,
  }
  const service = axios.create({
    ...defaultOptions,
    ...options,
  })
  // 请求拦截器
  service.interceptors.request.use(config => {
    // 如果请求的 URL 以 /aiChat 开头，移除 /api 前缀
    if (config.url && config.url.startsWith('/aiChat')) {
      config.baseURL = '';
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });
  setupInterceptors(service)
  return service
}

export const request = createAxios()

