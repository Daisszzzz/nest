<template>
  <el-dialog
    v-model="dialogFormVisible"
    :destroy-on-close="true"
    :title="title"
    style="max-width: 700px"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="Term Name" prop="monthCount">
        <el-input
          v-model.trim="formData.monthCount"
          autocomplete="off"
          placeholder="Please enter"
        />
      </el-form-item>
      <el-form-item label="Term Unit" prop="unit">
        <el-input
          v-model.trim="formData.unit"
          autocomplete="off"
          placeholder="Please enter, e.g. month"
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
import { TermInfoInterface } from '@/api/apartmentManagement/types'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { saveOrUpdateTerm } from '@/api/apartmentManagement'
const props = defineProps({
  updateTerm: {
    type: Function,
    default: () => ({}),
  },
})
const defaultFormData = {
  id: '',
  unit: '',
  monthCount: '',
}
const formRef = ref<FormInstance>()
const dialogFormVisible = ref(false)
const formData = ref<TermInfoInterface>({
  ...defaultFormData,
})
// Form validation rules
const rules = ref<FormRules>({
  unit: [{ required: true, message: 'Please enter term unit', trigger: 'blur' }],
  monthCount: [
    { required: true, message: 'Please enter term name', trigger: 'blur' },
  ],
})
const title = computed(() => {
  return (formData.value.id ? 'Edit ' : 'Add ') + 'Term'
})
// Show method
const show = (data: Partial<TermInfoInterface> = defaultFormData) => {
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
      await saveOrUpdateTerm(formData.value)
      await props.updateTerm()
      ElMessage.success('Operation successful')
      close()
    } else {
      ElMessage.error('Form validation failed, please check')
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
