import { request } from '@/utils'



export default {
  read: (params = {}) => request.get('/ota/sys/getList', { params }),
  create: (data) => request.post('/ota/sys/save', data),
  update: (data) => request.post(`/ota/sys/update`, data),
  delete: (data) => request.post(`/ota/sys/delete`, data),

  getAllDicData: (params = {}) => request.get('/dic', { params }),

}
