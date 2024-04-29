/**********************************
 * @Author: Kieslect Fashion
 * @LastEditor: Kieslect Fashion
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email: Kieslect Fashion@gmail.com
 * Copyright © 2024 专一 | https://www.kieslect.com
 **********************************/

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
