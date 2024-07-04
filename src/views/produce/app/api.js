/**********************************
 * @Author: Kieslect Fashion
 * @LastEditor: Kieslect Fashion
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email: Kieslect Fashion@gmail.com
 * Copyright © 2024 专一 | https://www.kieslect.com
 **********************************/

import { request } from '@/utils'

export default {
  read: (params = {}) => request.get('/app/sys/getList', { params }),
  create: (data) => request.post('/app/sys/save', data),
  update: (data) => request.post(`/app/sys/update`, data),
  delete: (id) => request.delete(`/app/sys/delete/${id}`),
  getAllDicData: (params = {}) => request.get('/dic', { params }),
  getAllHelperData: (params = {}) => request.get('/appHelpInfo/sys/getList', { params }),
  getAllHelperGuideData: (params = {}) => request.get('/helpGuide/findAll', { params }),


  apkRead: (data) => request.post('/apk/sys/getList', data),
  apkCreate: (data) => request.post('/apk/sys/save', data),
  apkUpdate: (data) => request.post(`/apk/sys/update`, data),
  apkDelete: (id) => request.delete(`/apk/sys/delete/${id}`),

  getAllParamType: () => request.get('/paramConfig/sys/getAllParamType'),
  getAllAttribute: () => request.get('/paramConfig/sys/getAllAttribute'),
  updateParam: (data) => request.patch(`/app/sys/updateParam/${data.id}`, data),

  getAppDownload: (appMark) => request.get(`/public/app/sys/getAppDownload/${appMark}`, { noNeedToken: true }),


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
