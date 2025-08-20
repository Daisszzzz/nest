<template>
  <el-dialog
    v-model="dialogFormVisible"
    :destroy-on-close="true"
    :title="title"
    style="max-width: 700px"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="Attribute Name" prop="name">
        <el-input
          v-model.trim="formData.name"
          autocomplete="off"
          placeholder="Please enter"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">Cancel</el-button>
        <el-button type="primary" @click="submitHandle">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { FeeValueInfoInterface } from '@/api/apartmentManagement/types'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { saveOrUpdateFeeKey } from '@/api/apartmentManagement'
const props = defineProps({
  updateFeeAddOrEditFee: {
    type: Function,
    default: () => ({}),
  },
})
const defaultFormData = {
  id: '',
  name: '',
}
const formRef = ref<FormInstance>()
const dialogFormVisible = ref(false)
const formData = ref<Pick<FeeValueInfoInterface, 'name' | 'id'>>({
  ...defaultFormData,
})
// Form validation rules
const rules = ref<FormRules>({
  name: [{ required: true, message: 'Please enter attribute name', trigger: 'blur' }],
})
const title = computed(() => {
  return (formData.value.id ? 'Edit' : 'Add') + ' Attribute'
})
// Show method
const show = (data: Partial<FeeValueInfoInterface> = defaultFormData) => {
  console.log('show', data)
  formData.value = Object.assign({}, defaultFormData, data)
  dialogFormVisible.value = true
}
// Close method
const close = () => {
  dialogFormVisible.value = false
}

// Submit method
const submitHandle = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      await saveOrUpdateFeeKey(formData.value)
      await props.updateFeeAddOrEditFee()
      ElMessage.success('Operation successful')
      close()
    } else {
      ElMessage.error('Form validation error, please check')
      return false
    }
  })
}
// Expose methods
defineExpose({
  show,
  close,
})
</script>

<style scoped lang="scss">
.icon-option {
  display: flex;
  align-items: center;
}
</style>
