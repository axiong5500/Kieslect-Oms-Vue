

import { request } from '@/utils'

export default {
  create: (data) => request.post('/dic', data),
  read: (params = {}) => request.get('/dic', { params }),
  update: (data) => request.patch(`/dic/update/${data.id}`, data),
  delete: (id) => request.delete(`/dic/${id}`),
}
