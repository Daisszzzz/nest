<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>Label Information Management</span>
      </div>
    </template>
    <el-row class="container" v-for="item in labelTypeList" :key="item">
      <el-col :span="2" class="text-center">{{ item.label }} Label</el-col>
      <el-col :span="22" class="item-container">
        <el-popconfirm
          v-for="item2 in item.children || []"
          :key="item2.id"
          width="220"
          confirm-button-text="Delete"
          cancel-button-text="Edit"
          cancel-button-type="warning"
          @confirm="deleteLabelHandle(item2)"
          @cancel="editLabelHandle(item2)"
          :title="`Edit or Delete ${item2.name}`"
        >
          <template #reference>
            <div class="item m-r-10 pointer">
              <el-tag style="padding: 13px">{{ item2.name }}</el-tag>
            </div>
          </template>
        </el-popconfirm>
        <el-icon
          class="item m-r-10 m-t-5 pointer"
          :size="35"
          color="#567722"
          @click="addLabelHandle(item)"
        >
          <CirclePlus />
        </el-icon>
      </el-col>
    </el-row>
    <!--    Label Information Edit Dialog Management-->
    <SupportLabelDialog
      ref="supportLabelDialog"
      :updateLabel="getLabelInfoListHandle"
    ></SupportLabelDialog>
  </el-card>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { LabelInfoInterface } from '@/api/apartmentManagement/types'
import {
  deleteLabelInfoById,
  getLabelInfoList,
} from '@/api/apartmentManagement'
import { BuildingTypeTypeMap } from '@/enums/constEnums'
import SupportLabelDialog from '@/views/apartmentManagement/attributeManagement/components/supportLabelDialog.vue'
import { ElMessage } from 'element-plus'
type SupportLabelInterface = {
  label: string
  value: string
  children?: LabelInfoInterface[]
}
const supportLabelDialog = ref<InstanceType<typeof SupportLabelDialog>>()
// Label types
const labelTypeList = ref<SupportLabelInterface[]>([])
// Get label information
async function getLabelInfoListHandle() {
  try {
    const { data } = await getLabelInfoList()
    labelTypeList.value = JSON.parse(JSON.stringify(BuildingTypeTypeMap))
    data.forEach((item) => {
      // Get the corresponding type name
      const targetType = labelTypeList.value.find(
        (item2) => item2.value === item.type,
      )
      if (targetType) {
        targetType.children = targetType.children || []
        targetType.children.push(item)
      }
    })
  } catch (error) {
    console.log(error)
  }
}
// Delete label
const deleteLabelHandle = async (item: LabelInfoInterface) => {
  console.log('Delete label', item)
  try {
    await deleteLabelInfoById(item.id)
    await getLabelInfoListHandle()
    ElMessage.success('Operation successful')
  } catch (error) {
    console.log(error)
  }
}
// Edit label
const editLabelHandle = (item: LabelInfoInterface) => {
  console.log('Edit label', item)
  supportLabelDialog.value?.show(item)
}
// Add label
const addLabelHandle = (item: SupportLabelInterface) => {
  console.log('Add label', item)
  supportLabelDialog.value?.show({ type: item.value })
}
onMounted(() => {
  getLabelInfoListHandle()
})
</script>

<style scoped lang="scss">
.card-header {
  font-size: 18px;
  font-weight: bold;
}

.text-center {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
}

.container:not(:first-child) {
  margin-top: 20px;
}

.item-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 10px 15px;
  background-color: #efefef;
  border-radius: 20px;

  .item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>
