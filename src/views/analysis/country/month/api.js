

import { request } from '@/utils/index.js'

export default {
  read: (params = {}) => request.get('/oms/analysis/country/month/getList', { params }),
  getAllDicData: (params = {}) => request.get('/dic', { params }),
}
