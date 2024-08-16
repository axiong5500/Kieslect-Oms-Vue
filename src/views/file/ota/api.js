import { request } from '@/utils'



export default {
  read: (params = {}) => request.get('/ota/sys/getList', { params }),
  create: (data) => request.post('/ota/sys/save', data),
  update: (data) => request.post(`/ota/sys/update`, data),
  delete: (data) => request.post(`/ota/sys/delete`, data),

  getAllDicData: (params = {}) => request.get('/dic', { params }),


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
