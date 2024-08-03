

import { request } from '@/utils'

export default {
  create: (data) => request.post('/paramConfig/sys/save', data),
  read: (params = {}) => request.get('/paramConfig/sys/getList', { params }),
  update: (data) => request.patch(`/paramConfig/sys/update/${data.id}`, data),
  delete: (id) => request.delete(`/paramConfig/sys/delete/${id}`),

  getAllRoles: () => request.get('/role?enable=1'),
  getAllParamType: () => request.get('/paramConfig/sys/getAllParamType'),
  getAllParamGroup: () => request.get('/paramConfig/sys/getAllParamGroup'),

}
