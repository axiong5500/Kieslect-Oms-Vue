

import { request } from '@/utils'

export default {
  create: (data) => request.post('/device/sys/save', data),
  read: (params = {}) => request.get('/device/sys/getList', { params }),
  update: (data) => request.patch(`/device/sys/update/${data.id}`, data),
  updateParam: (data) => request.patch(`/device/sys/updateParam/${data.id}`, data),
  delete: (id) => request.delete(`/device/sys/delete/${id}`),
  insertRow: (data) => request.post(`/device/sys/insertRow`, data),

  getAllDicData: (params = {}) => request.get('/dic', { params }),

  getAllParamType: () => request.get('/paramConfig/sys/getAllParamType'),
  getAllAttribute: () => request.get('/paramConfig/sys/getAllAttribute'),

  uploadFile: (file,fileType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pathType', fileType);

    return request.post('/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // 设置请求头，告诉后端是文件上传
      }
    });
  }
}
