

import { request } from '@/utils'

export default {
  read: (params = {}) => request.get('/video/sys/getList', { params }),
  create: (data) => request.post('/video/sys/save', data),
  update: (data) => request.post(`/video/sys/update`, data),
  delete: (data) => request.post(`/video/sys/delete`,data),
  getAllDicData: (params = {}) => request.get('/dic', { params }),
}
