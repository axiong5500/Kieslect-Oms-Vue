/**********************************
 * @Author: Kieslect Fashion
 * @LastEditor: Kieslect Fashion
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email: Kieslect Fashion@gmail.com
 * Copyright © 2024 专一 | https://www.kieslect.com
 **********************************/

import { request } from '@/utils'

export default {
  read: (params = {}) => request.get('/app/sys/getList', { params }),
  create: (data) => request.post('/app/sys/save', data),
  update: (data) => request.post(`/app/sys/update`, data),
  delete: (id) => request.delete(`/app/sys/delete/${id}`),
}
