/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:22:49
 * @Email: zclzone@outlook.com
 * Copyright © 2024 遥遥领先 | https://www.kieslect.com
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
