/**********************************
 * @Author: Kieslect Fashion
 * @LastEditor: Kieslect Fashion
 * @LastEditTime: 2023/12/05 21:28:30
 * @Email: Kieslect Fashion@gmail.com
 * Copyright © 2024 专一 | https://www.kieslect.com
 **********************************/

import { request } from '@/utils'

export default {
  toggleRole: (data) => request.post('/auth/role/toggle', data),
  login: (data) => request.post('/auth/login', data, { noNeedToken: true }),
  getUser: () => request.get('/user/detail'),
}
