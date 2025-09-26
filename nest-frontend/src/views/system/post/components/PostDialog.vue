<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :destroy-on-close="true"
    width="500px"
  >
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :model="postData"
    >
      <el-form-item label="Post Name" prop="name">
        <el-input
          v-model.trim="postData.name"
          placeholder="Please enter post name"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="Post Code" prop="postCode">
        <el-input
          v-model.trim="postData.postCode"
          placeholder="Please enter post code"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input
          v-model.trim="postData.description"
          placeholder="Please enter description"
          clearable
          type="textarea"
        ></el-input>
      </el-form-item>

      <el-form-item label="Status" prop="status">
        <el-radio-group v-model="postData.status">
          <el-radio :label="1">Active</el-radio>
          <el-radio :label="0">Inactive</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button
        type="primary"
        @click="handleSubmit(ruleFormRef)"
        :loading="loading"
      >
        Confirm
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { PostInterfacesRes } from '@/api/system/types'
interface DialogProps {
  rowData?: PostInterfacesRes
  api?: (params: any) => Promise<any>
  getTableList?: () => Promise<any>
}

let postData = ref<PostInterfacesRes>({} as PostInterfacesRes)
const rules = reactive({
  name: [{ required: true, message: 'Please enter post name' }],
  postCode: [{ required: true, message: 'Please enter post code' }],
  description: [{ required: true, message: 'Please enter description' }],
})

const dialogVisible = ref(false)
// dialog title
const title = ref<string>()
const loading = ref<boolean>(false)

// props definition
const dialogProps = ref<DialogProps>()
// Receive parameters from parent component
const acceptParams = (params: DialogProps): void => {
  const row: any = params.rowData
  postData.value = row
  title.value = getDialogTitle(params)
  dialogProps.value = params
  dialogVisible.value = true
}
// Initialize dialog title
const getDialogTitle = (params: DialogProps): string => {
  return params.rowData?.id ? 'Edit' : 'Add'
}
const ruleFormRef = ref<FormInstance>()

const handleSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (!valid) return
    try {
      loading.value = true
      await dialogProps.value?.api!(postData.value)
      ElMessage.success({ message: `${title.value} succeeded!` })
      dialogProps.value?.getTableList!()
      dialogVisible.value = false
      loading.value = false
      // Reset form
      resetForm(formEl)
    } catch (error) {
      loading.value = false
      console.log(error)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
// Expose methods to parent component
defineExpose({
  acceptParams,
})
</script>

<style lang="scss" scoped></style>
