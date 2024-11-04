

import { request } from '@/utils/index.js'

export default {
  read: (params = {}) => {

    // 格式化日期范围
    if (params.dateRange && Array.isArray(params.dateRange)) {
      // 将 Unix 时间戳数组转换为字符串
      params.dateRange = params.dateRange.join(',')
    }
    return request.get('/oms/analysis/country/daily/getList', { params })
  },

  getAllDicData: (params = {}) => request.get('/dic', { params }),
}
