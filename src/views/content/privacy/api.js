/**********************************
 * @Author: Kieslect Fashion
 * @LastEditor: Kieslect Fashion
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email: Kieslect Fashion@gmail.com
 * Copyright © 2024 专一 | https://www.kieslect.com
 **********************************/

import { request } from '@/utils'

export default {
    getPrivacyPolicy:(articleId,languageValue)=> request.get(`/article/sys/getArticleById?id=${articleId}&language=${languageValue}`,{ noNeedToken: true }),
}
