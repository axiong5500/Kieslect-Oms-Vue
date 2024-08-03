

import { request } from '@/utils'

export default {
  create: (data) => request.post('/moduleConfig/sys/save', data),
  read: (params = {}) => request.get('/moduleConfig/sys/getList', { params }),
  update: (data) => request.patch(`/moduleConfig/sys/update/${data.id}`, data),
  delete: (id) => request.delete(`/moduleConfig/sys/delete/${id}`),

  getAllRoles: () => request.get('/role?enable=1'),
  getAllParamType: () => request.get('/paramConfig/sys/getAllParamType'),
  getAllParamGroup: () => request.get('/paramConfig/sys/getAllParamGroup'),
}
