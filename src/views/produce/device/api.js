/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email: zclzone@outlook.com
 * Copyright © 2024 遥遥领先 | https://www.kieslect.com
 **********************************/

import { request } from '@/utils'

export default {
  create: (data) => request.post('/device/sys/save', data),
  read: (params = {}) => request.get('/device/sys/getList', { params }),
  update: (data) => request.patch(`/device/sys/update/${data.id}`, data),
  updateParam: (data) => request.patch(`/device/sys/updateParam/${data.id}`, data),
  delete: (id) => request.delete(`/device/sys/delete/${id}`),

  getAllParamType: () => request.get('/paramConfig/getAllParamType'),
  getAllParamGroup: () => request.get('/paramConfig/getAllParamGroup'),
  getAllAttribute: () => request.get('/paramConfig/getAllAttribute'),
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
