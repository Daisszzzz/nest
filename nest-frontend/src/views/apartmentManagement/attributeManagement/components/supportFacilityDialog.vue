<template>
  <el-dialog
    v-model="dialogFormVisible"
    :destroy-on-close="true"
    :title="title"
    style="max-width: 700px"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="Facility Name" prop="name">
        <el-input
          v-model.trim="formData.name"
          autocomplete="off"
          placeholder="Please enter"
        />
      </el-form-item>
      <el-form-item label="Facility Icon" prop="icon">
        <el-select
          v-model="formData.icon"
          placeholder="Please select a facility icon"
          clearable
          filterable
        >
          <el-option
            class="icon-option"
            v-for="item in icons"
            :key="item"
            :value="item"
          >
            <SvgIcon size="25" color="black" :name="`rent-${item}`" />
            <span class="m-l-10">{{ item }}</span>
          </el-option>
        </el-select>
        <SvgIcon
          v-if="formData.icon"
          size="25"
          class="m-l-10"
          color="black"
          :name="`rent-${formData.icon}`"
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
import ids from 'virtual:svg-icons-names'
import { computed, ref } from 'vue'
import { FacilityInfoInterface } from '@/api/apartmentManagement/types'
import { BuildingTypeTypeMap, getLabelByValue } from '@/enums/constEnums'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { saveOrUpdateFacilityInfo } from '@/api/apartmentManagement'
const props = defineProps({
  updateFacility: {
    type: Function,
    default: () => ({}),
  },
})
const defaultFormData = {
  id: '',
  type: '',
  name: '',
  icon: '',
}
const formRef = ref<FormInstance>()
const dialogFormVisible = ref(false)
const formData = ref<FacilityInfoInterface>({
  ...defaultFormData,
})
// Form validation rules
const rules = ref<FormRules>({
  name: [{ required: true, message: 'Please enter the facility name', trigger: 'blur' }],
  icon: [{ required: true, message: 'Please select a facility icon', trigger: 'change' }],
})
const title = computed(() => {
  return (
    (formData.value.id ? 'Edit ' : 'Add ') +
    getLabelByValue(BuildingTypeTypeMap, formData.value.type) +
    ' Facility'
  )
})
// Filter all facility icons
const icons = ids
  .filter((id) => id.startsWith('icon-rent-'))
  .map((id) => id.replace('icon-rent-', ''))
// Show method
const show = (data: Partial<FacilityInfoInterface> = defaultFormData) => {
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
      await saveOrUpdateFacilityInfo(formData.value)
      await props.updateFacility()
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
