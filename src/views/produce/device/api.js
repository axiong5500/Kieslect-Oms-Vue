/**********************************
 * @Author: Kieslect Fashion
 * @LastEditor: Kieslect Fashion
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email: Kieslect Fashion@gmail.com
 * Copyright © 2024 专一 | https://www.kieslect.com
 **********************************/

import { request } from '@/utils'

export default {
  create: (data) => request.post('/device/sys/save', data),
  read: (params = {}) => request.get('/device/sys/getList', { params }),
  update: (data) => request.patch(`/device/sys/update/${data.id}`, data),
  updateParam: (data) => request.patch(`/device/sys/updateParam/${data.id}`, data),
  delete: (id) => request.delete(`/device/sys/delete/${id}`),
  getAllDicData: (params = {}) => request.get('/dic', { params }),

  getAllParamType: () => request.get('/paramConfig/sys/getAllParamType'),
  getAllParamGroup: () => request.get('/paramConfig/sys/getAllParamGroup'),
  getAllAttribute: () => request.get('/paramConfig/sys/getAllAttribute'),
  getAllApp: () => request.get('/app/sys/getList'),
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return request.post('/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // 设置请求头，告诉后端是文件上传
      }
    });
  }
}
