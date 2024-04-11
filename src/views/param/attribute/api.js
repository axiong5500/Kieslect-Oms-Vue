/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { request } from '@/utils'

export default {
  create: (data) => request.post('/paramConfig/save', data),
  read: (params = {}) => request.get('/paramConfig/getList', { params }),
  update: (data) => request.patch(`/paramConfig/update/${data.id}`, data),
  delete: (id) => request.delete(`/paramConfig/delete/${id}`),

  getAllRoles: () => request.get('/role?enable=1'),
  getAllParamType: () => request.get('/paramConfig/getAllParamType'),
  getAllParamGroup: () => request.get('/paramConfig/getAllParamGroup'),

}
