

import { request } from '@/utils'

export default {
  read: (params = {}) => request.get('/appHelpInfo/sys/getList', { params }),
  create: (data) => request.post('/appHelpInfo/sys/save', data),
  update: (data) => request.post(`/appHelpInfo/sys/update`, data),
  delete: (data) => request.post(`/appHelpInfo/sys/delete`,data),

}
