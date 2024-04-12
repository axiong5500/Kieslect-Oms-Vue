/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:28:30
 * @Email: zclzone@outlook.com
 * Copyright © 2024 遥遥领先 | https://www.kieslect.com
 **********************************/

import { request } from '@/utils'

export default {
  toggleRole: (data) => request.post('/auth/role/toggle', data),
  login: (data) => request.post('/auth/login', data, { noNeedToken: true }),
  getUser: () => request.get('/user/detail'),
}
