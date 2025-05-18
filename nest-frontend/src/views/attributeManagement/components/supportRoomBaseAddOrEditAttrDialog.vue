<template>
  <el-dialog
    v-model="dialogFormVisible"
    :destroy-on-close="true"
    :title="title"
    style="max-width: 700px"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="attribute name" prop="name">
        <el-input
          v-model.trim="formData.name"
          autocomplete="off"
          placeholder="please type in"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">cancel</el-button>
        <el-button type="primary" @click="submitHandle">confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { AttrValueInfoInterface } from '@/api/apartmentManagement/types'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { saveOrUpdateAttrKey } from '@/api/apartmentManagement'
const props = defineProps({
  updateRoomBaseAddOrEditAttr: {
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
const formData = ref<Pick<AttrValueInfoInterface, 'name' | 'id'>>({
  ...defaultFormData,
})

const rules = ref<FormRules>({
  name: [{ required: true, message: 'please type in attribute name', trigger: 'blur' }],
})
const title = computed(() => {
  return (formData.value.id ? 'modify' : 'add') + 'attribute'
})

const show = (data: Partial<AttrValueInfoInterface> = defaultFormData) => {
  console.log('show', data)
  formData.value = Object.assign({}, defaultFormData, data)
  dialogFormVisible.value = true
}

const close = () => {
  dialogFormVisible.value = false
}


const submitHandle = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      await saveOrUpdateAttrKey(formData.value)
      await props.updateRoomBaseAddOrEditAttr()
      ElMessage.success('operate succefully')
      close()
    } else {
      ElMessage.error('The form contains errors. Please check.')
      return false
    }
  })
}

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
