/**********************************
 * @FilePath: index.js
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/04 22:46:28
 * @Email: zclzone@outlook.com
 * Copyright © 2024 遥遥领先 | https://www.kieslect.com
 **********************************/

import axios from 'axios'
import { setupInterceptors } from './interceptors'

export function createAxios(options = {}) {
  const defaultOptions = {
    baseURL: '/api',
    timeout: 12000,
  }
  const service = axios.create({
    ...defaultOptions,
    ...options,
  })
  setupInterceptors(service)
  return service
}

export const request = createAxios()

export const mockRequest = createAxios({
  baseURL: '/mock-api',
})
