/**********************************
 * @Author: Kieslect Fashion
 * @LastEditor: Kieslect Fashion
 * @LastEditTime: 2023/12/05 21:22:49
 * @Email: Kieslect Fashion@gmail.com
 * Copyright © 2024 专一 | https://www.kieslect.com
 **********************************/

export const useModal = () => {
  const modalRef = ref(null)
  const okLoading = computed({
    get() {
      return modalRef.value?.okLoading
    },
    set(v) {
      modalRef.value.okLoading = v
    },
  })
  return [modalRef, okLoading]
}
