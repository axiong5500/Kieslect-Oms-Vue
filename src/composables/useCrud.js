

import { useModal, useForm } from '.'

const ACTIONS = {
  view: '查看',
  edit: '编辑',
  add: '新增',
  editParam:'编辑参数'
}

export const useCrud = ({ name, initForm = {}, doCreate, doDelete, doUpdate,doUpdateParam, refresh }) => {
  const modalAction = ref('')
  const [modalRef, okLoading] = useModal()
  const [modalFormRef, modalForm, validation] = useForm(initForm)

  /** 新增 */
  function handleAdd(row = {}, title) {
    handleOpen({ action: 'add', title, row: { ...initForm, ...row } })
  }

  /** 修改 */
  function handleEdit(row, title) {
    handleOpen({ action: 'edit', title, row })
  }

  function handleEditParam(row, title) {
    handleOpen({ action: 'editParam', title, row })
  }

  /** 查看 */
  function handleView(row, title) {
    handleOpen({ action: 'view', title, row })
  }

  /** 打开modal */
  function handleOpen(options = {}) {
    const { action, row, title, onOk } = options
    modalAction.value = action
    modalForm.value = { ...row }
    modalRef.value?.open({
      ...options,
      async onOk() {
        if (typeof onOk === 'function') {
          return await onOk()
        } else {
          return await handleSave()
        }
      },
      title: title ?? (ACTIONS[modalAction.value] || '') + name,
    })
  }

  /** 保存 */
  async function handleSave(action) {
    if (!action && !['edit', 'add','editParam'].includes(modalAction.value)) {
      return false
    }
    await validation()
    const actions = {
      add: {
        api: () => doCreate(modalForm.value),
        cb: () => $message.success('新增成功'),
      },
      edit: {
        api: () => doUpdate(modalForm.value),
        cb: () => $message.success('保存成功'),
      },
      editParam: {
        api: () => doUpdateParam(modalForm.value),
        cb: () => $message.success('保存成功'),
      }
    }

    action = action || actions[modalAction.value]

    try {
      okLoading.value = true
      const data = await action.api()
      action.cb()
      okLoading.value = false
      data && refresh(data)
    } catch (error) {
      okLoading.value = false
      return false
    }
  }

  /** 删除 */
  function handleDelete(id, confirmOptions) {
    if (!id && id !== 0) return
    const d = $dialog.warning({
      content: '确定删除？',
      title: '提示',
      positiveText: '确定',
      negativeText: '取消',
      async onPositiveClick() {
        try {
          d.loading = true
          const data = await doDelete(id)
          $message.success('删除成功')
          d.loading = false
          refresh(data)
        } catch (error) {
          d.loading = false
        }
      },
      ...confirmOptions,
    })
  }

  return {
    modalRef,
    modalFormRef,
    modalAction,
    modalForm,
    okLoading,
    validation,
    handleAdd,
    handleDelete,
    handleEdit,
    handleView,
    handleEditParam,
    handleOpen,
    handleSave,
  }
}
