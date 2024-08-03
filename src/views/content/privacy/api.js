

import { request } from '@/utils'

export default {
    getPrivacyPolicy:(articleId,languageValue)=> request.get(`/article/sys/getArticleById?id=${articleId}&language=${languageValue}`,{ noNeedToken: true }),
}
