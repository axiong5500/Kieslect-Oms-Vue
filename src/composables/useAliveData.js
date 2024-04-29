/**********************************
 * @Author: Kieslect Fashion
 * @LastEditor: Kieslect Fashion
 * @LastEditTime: 2023/12/05 21:22:28
 * @Email: Kieslect Fashion@gmail.com
 * Copyright © 2024 专一 | https://www.kieslect.com
 **********************************/

const lastDataMap = new Map()
export const useAliveData = (initData = {}, key) => {
  key = key ?? useRoute().name
  const lastData = lastDataMap.get(key)
  const aliveData = ref(lastData || { ...initData })

  watch(
    aliveData,
    (v) => {
      lastDataMap.set(key, v)
    },
    { deep: true }
  )

  return {
    aliveData,
    reset() {
      aliveData.value = { ...initData }
      lastDataMap.delete(key)
    },
  }
}
