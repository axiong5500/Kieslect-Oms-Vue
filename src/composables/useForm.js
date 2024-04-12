/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:22:43
 * @Email: zclzone@outlook.com
 * Copyright © 2024 遥遥领先 | https://www.kieslect.com
 **********************************/

export const useForm = (initFormData = {}) => {
  const formRef = ref(null)
  const formModel = ref({ ...initFormData })
  const rules = {
    required: {
      required: true,
      message: '此为必填项',
      trigger: ['blur', 'change'],
    },
  }
  const validation = () => {
    return formRef.value?.validate()
  }
  return [formRef, formModel, validation, rules]
}
