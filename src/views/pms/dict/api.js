/**********************************
 * @Author: Kieslect Fashion
 * @LastEditor: Kieslect Fashion
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email: Kieslect Fashion@gmail.com
 * Copyright © 2024 专一 | https://www.kieslect.com
 **********************************/

import { request } from '@/utils'

export default {
  create: (data) => request.post('/dic', data),
  read: (params = {}) => request.get('/dic', { params }),
  update: (data) => request.patch(`/dic/${data.id}`, data),
  delete: (id) => request.delete(`/dic/${id}`),
}
