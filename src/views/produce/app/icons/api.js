/**********************************
 * @Author: Kieslect Fashion
 * @LastEditor: Kieslect Fashion
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email: Kieslect Fashion@gmail.com
 * Copyright © 2024 专一 | https://www.kieslect.com
 **********************************/

import { request } from '@/utils'

export default {
  read: (params = {}) => request.get('/icon/sys/getList', { params }),
  create: (data) => request.post('/icon/sys/save', data),
  update: (data) => request.post(`/icon/sys/update`, data),
  delete: (data) => request.post(`/icon/sys/delete`,data),


  uploadFile: (file) => {
    const formData = new FormData()
    formData.append('file', file)

    return request.post('/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // 设置请求头，告诉后端是文件上传
      },
      timeout: 60000, // 自定义上传文件的超时时间为 60 秒
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        console.log(`Upload progress: ${percentCompleted}%`)
      }
    })
  }
}
