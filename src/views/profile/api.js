/**********************************
 * @Author: Kieslect Fashion
 * @LastEditor: Kieslect Fashion
 * @LastEditTime: 2023/12/05 21:30:03
 * @Email: Kieslect Fashion@gmail.com
 * Copyright © 2024 专一 | https://www.kieslect.com
 **********************************/

import { request } from '@/utils'

export default {
  changePassword: (data) => request.post('/auth/password', data),
  updateProfile: (data) => request.patch(`/user/profile/${data.id}`, data),
}
