<template>
  <el-dialog
    v-model="dialogFormVisible"
    :destroy-on-close="true"
    :title="title"
    style="max-width: 700px"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="Payment Method Name" prop="name">
        <el-input
          v-model.trim="formData.name"
          autocomplete="off"
          placeholder="Please enter, e.g. Monthly Payment"
        />
      </el-form-item>
      <el-form-item label="Months per Payment" prop="payMonthCount">
        <el-input-number
          v-model.trim="formData.payMonthCount"
          :min="1"
          step-strictly
          placeholder="Please enter, e.g. 3"
        />
      </el-form-item>
      <el-form-item label="Payment Method Description" prop="additionalInfo">
        <el-input
          v-model.trim="formData.additionalInfo"
          autocomplete="off"
          placeholder="Please enter, e.g. Deposit one pay one"
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
import { PaymentInfoInterface } from '@/api/apartmentManagement/types'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { saveOrUpdatePayment } from '@/api/apartmentManagement'
const props = defineProps({
  update: {
    type: Function,
    default: () => ({}),
  },
})
const defaultFormData = {
  id: '',
  name: '',
  payMonthCount: 1,
  additionalInfo: '',
}
const formRef = ref<FormInstance>()
const dialogFormVisible = ref(false)
const formData = ref<PaymentInfoInterface>({
  ...defaultFormData,
})
// Form validation rules
const rules = ref<FormRules>({
  name: [{ required: true, message: 'Payment method name is required', trigger: 'blur' }],
  payMonthCount: [
    { required: true, message: 'Please enter months per payment', trigger: 'blur' },
  ],
  additionalInfo: [
    { required: true, message: 'Please enter payment method description', trigger: 'blur' },
  ],
})
const title = computed(() => {
  return (formData.value.id ? 'Edit ' : 'Add ') + 'Payment Method'
})
// Show dialog
const show = (data: Partial<PaymentInfoInterface> = defaultFormData) => {
  console.log('show', data)
  formData.value = Object.assign({}, defaultFormData, data)
  dialogFormVisible.value = true
}
// Close dialog
const close = () => {
  dialogFormVisible.value = false
}

// Submit handler
const submitHandle = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      await saveOrUpdatePayment(formData.value)
      await props.update()
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
