import { request } from '@/utils'



export default {
  read: (params = {}) => request.get('/issue/sys/getList', { params }),
  create: (data) => request.post('/issue/sys/save', data),
  update: (data) => request.post(`/issue/sys/update`, data),
  delete: (data) => request.post(`/issue/sys/delete`, data),

  getAllDicData: (params = {}) => request.get('/dic', { params }),

}
