

import { request } from '@/utils'

export default {
  read: (params = {}) => request.get('/opearationLog', { params }),
}
