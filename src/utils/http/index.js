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

  setupInterceptors(service)
  return service
}

export const request = createAxios()

