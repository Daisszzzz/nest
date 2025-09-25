<template>
  <el-dialog
    v-model="dialogFormVisible"
    :destroy-on-close="true"
    :title="title"
    style="max-width: 700px"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="Attribute Value Name" prop="name">
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
import { AttrValueInfoInterface } from '@/api/apartmentManagement/types'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { saveOrUpdateAttrValue } from '@/api/apartmentManagement'
const props = defineProps({
  updateRoomBase: {
    type: Function,
    default: () => ({}),
  },
})
const defaultFormData = {
  id: '',
  attrKeyId: '',
  name: '',
  attrKeyName: '',
}
const formRef = ref<FormInstance>()
const dialogFormVisible = ref(false)
const formData = ref<AttrValueInfoInterface & { attrKeyName: string }>({
  ...defaultFormData,
})
// Form validation rules
const rules = ref<FormRules>({
  name: [{ required: true, message: 'Please enter attribute name', trigger: 'blur' }],
})
const title = computed(() => {
  return (
    (formData.value.id ? 'Edit ' : 'Add ') + formData.value.attrKeyName + ' Attribute'
  )
})
// Show dialog
const show = (data: Partial<AttrValueInfoInterface> = defaultFormData) => {
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
      await saveOrUpdateAttrValue(formData.value)
      await props.updateRoomBase()
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
