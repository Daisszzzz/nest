<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>Room Basic Information Management</span>
      </div>
    </template>
    <el-row class="container" v-for="item in attrTypeList" :key="item">
      <el-col :span="2" class="text-center">
        <el-popconfirm
          width="220"
          confirm-button-text="Delete"
          cancel-button-text="Edit"
          cancel-button-type="warning"
          @confirm="deleteAttrHandle(item)"
          @cancel="editAttrHandle(item)"
          :title="`Edit or Delete ${item.name}`"
        >
          <template #reference>
            <div class="item m-r-10 pointer">
              <span>{{ item.name }}</span>
              <el-tooltip
                effect="dark"
                content="Click the attribute name to edit/delete"
                placement="top-start"
              >
                <el-icon class="m-l-5"><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-popconfirm>
      </el-col>
      <el-col :span="22" class="item-container">
        <el-popconfirm
          v-for="item2 in item.attrValueList || []"
          :key="item2.id"
          width="220"
          confirm-button-text="Delete"
          cancel-button-text="Edit"
          cancel-button-type="warning"
          @confirm="deleteRoomBaseHandle(item2)"
          @cancel="editRoomBaseHandle(item2)"
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
          @click="addRoomBaseHandle(item)"
        >
          <CirclePlus />
        </el-icon>
      </el-col>
    </el-row>
    <el-button
      type="primary"
      class="m-t-20"
      @click="addAttrHandle"
    >
      Add New Attribute
    </el-button>
    <!--    Information Edit Dialog Management-->
    <SupportRoomBaseDialog
      ref="supportRoomBaseDialog"
      :updateRoomBase="getRoomBaseInfoListHandle"
    ></SupportRoomBaseDialog>
    <!--    Attribute Edit Dialog Management-->
    <supportRoomBaseAddOrEditAttrDialog
      ref="supportRoomBaseAddOrEditAttrDialog"
      :updateRoomBaseAddOrEditAttr="getRoomBaseInfoListHandle"
    ></supportRoomBaseAddOrEditAttrDialog>
  </el-card>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  AttrInfoInfoInterface,
  AttrValueInfoInterface,
} from '@/api/apartmentManagement/types'
import {
  deleteAttrKeyById,
  deleteAttrValueById,
  getAttrInfoList,
} from '@/api/apartmentManagement'
import SupportRoomBaseDialog from '@/views/apartmentManagement/attributeManagement/components/supportRoomBaseDialog.vue'
import { ElMessage } from 'element-plus'
import SupportRoomBaseAddOrEditAttrDialog from '@/views/apartmentManagement/attributeManagement/components/supportRoomBaseAddOrEditAttrDialog.vue'
import { ButtonPermission } from '@/enums/constEnums'
const supportRoomBaseDialog = ref<InstanceType<typeof SupportRoomBaseDialog>>()
const supportRoomBaseAddOrEditAttrDialog =
  ref<InstanceType<typeof SupportRoomBaseAddOrEditAttrDialog>>()

// Attribute types
const attrTypeList = ref<AttrInfoInfoInterface[]>([])
// Get attribute information
async function getRoomBaseInfoListHandle() {
  try {
    const { data } = await getAttrInfoList()
    data.forEach((item) => {
      item.attrValueList?.forEach((item2) => {
        item2.attrKeyName = item.name
      })
    })
    attrTypeList.value = data
  } catch (error) {
    console.log(error)
  }
}
// Delete attribute value
const deleteRoomBaseHandle = async (item: AttrValueInfoInterface) => {
  console.log('Delete', item)
  try {
    await deleteAttrValueById(item.id)
    await getRoomBaseInfoListHandle()
    ElMessage.success('Operation successful')
  } catch (error) {
    console.log(error)
  }
}
// Edit attribute value
const editRoomBaseHandle = (item: AttrValueInfoInterface) => {
  console.log('Edit', item)
  supportRoomBaseDialog.value?.show(item)
}
// Add attribute value
const addRoomBaseHandle = (item: AttrInfoInfoInterface) => {
  console.log('Add attribute', item)
  supportRoomBaseDialog.value?.show({
    attrKeyId: item.id,
    attrKeyName: item.name,
  })
}
// Add new attribute
const addAttrHandle = () => {
  supportRoomBaseAddOrEditAttrDialog.value?.show()
}
// Delete attribute
const deleteAttrHandle = async (item: AttrInfoInfoInterface) => {
  console.log('Delete', item)
  try {
    await deleteAttrKeyById(item.id)
    await getRoomBaseInfoListHandle()
    ElMessage.success('Operation successful')
  } catch (error) {
    console.log(error)
  }
}
const editAttrHandle = (item: AttrInfoInfoInterface) => {
  console.log('Edit', item)
  supportRoomBaseAddOrEditAttrDialog.value?.show(item)
}
onMounted(() => {
  getRoomBaseInfoListHandle()
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
