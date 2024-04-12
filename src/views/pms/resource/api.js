/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2024/04/01 15:52:04
 * @Email: zclzone@outlook.com
 * Copyright © 2024 遥遥领先 | https://www.kieslect.com
 **********************************/

import axios from 'axios'
import { request } from '@/utils'

export default {
  getMenuTree: () => request.get('/permission/menu/tree'),
  getButtons: ({ parentId }) => request.get(`/permission/button/${parentId}`),
  getComponents: () => axios.get(`${import.meta.env.VITE_PUBLIC_PATH}components.json`),
  addPermission: (data) => request.post('/permission', data),
  savePermission: (id, data) => request.patch(`/permission/${id}`, data),
  deletePermission: (id) => request.delete(`permission/${id}`),
}
